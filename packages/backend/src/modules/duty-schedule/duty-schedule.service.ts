import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateDutyScheduleDto,
  UpdateDutyScheduleDto,
  DutyScheduleResponseDto,
  DutyScheduleQueryDto,
  SwapDutyDto,
  BatchCreateDutyScheduleDto,
  DutyScheduleByDateDto,
} from '@shared/dto/duty.dto';
import { IDutySchedule } from '@shared/interfaces';
import {
  DutyShiftType,
  DutyStatus,
  NotificationType,
} from '@shared/enums';

@Injectable()
export class DutyScheduleService {
  private dutySchedules: Map<string, IDutySchedule> = new Map();
  private dateIndex: Map<string, string[]> = new Map();

  constructor() {}

  async create(
    dto: CreateDutyScheduleDto,
    creatorId: string,
  ): Promise<IDutySchedule> {
    const existingOnSameDate = this.findByDateAndCounselor(
      dto.date,
      dto.counselorId,
    );
    if (existingOnSameDate.length > 0) {
      throw new BadRequestException('该咨询师在该日期已有值班安排');
    }

    const dutySchedule: IDutySchedule = {
      id: this.generateId(),
      counselorId: dto.counselorId,
      counselorName: this.getCounselorName(dto.counselorId),
      date: new Date(dto.date),
      shiftType: dto.shiftType,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: DutyStatus.SCHEDULED,
      roomId: dto.roomId,
      roomName: dto.roomId ? `房间${dto.roomId}` : undefined,
      isEmergencyDuty: dto.isEmergencyDuty || false,
      phone: dto.phone,
      notes: dto.notes,
      swapRequested: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: creatorId,
    };

    this.dutySchedules.set(dutySchedule.id, dutySchedule);
    this.addToDateIndex(dutySchedule);

    return dutySchedule;
  }

  async batchCreate(
    dto: BatchCreateDutyScheduleDto,
    creatorId: string,
  ): Promise<IDutySchedule[]> {
    const results: IDutySchedule[] = [];

    for (const schedule of dto.schedules) {
      try {
        const result = await this.create(
          {
            counselorId: dto.counselorId,
            date: schedule.date,
            shiftType: schedule.shiftType,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            roomId: schedule.roomId,
            isEmergencyDuty: schedule.isEmergencyDuty,
          },
          creatorId,
        );
        results.push(result);
      } catch (e) {
      }
    }

    return results;
  }

  async findAll(
    query: DutyScheduleQueryDto,
  ): Promise<{ items: IDutySchedule[]; total: number }> {
    let results = Array.from(this.dutySchedules.values());

    if (query.counselorId) {
      results = results.filter((d) => d.counselorId === query.counselorId);
    }
    if (query.shiftType) {
      results = results.filter((d) => d.shiftType === query.shiftType);
    }
    if (query.status) {
      results = results.filter((d) => d.status === query.status);
    }
    if (query.isEmergencyDuty !== undefined) {
      results = results.filter((d) => d.isEmergencyDuty === query.isEmergencyDuty);
    }
    if (query.startDate) {
      const start = new Date(query.startDate);
      results = results.filter((d) => new Date(d.date) >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      results = results.filter((d) => new Date(d.date) <= end);
    }

    results.sort(
      (a, b) =>
        new Date(b.date).getTime() + b.startTime.localeCompare(a.startTime),
    );

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    return {
      items: paginated,
      total: results.length,
    };
  }

  async findOne(id: string): Promise<IDutySchedule> {
    const dutySchedule = this.dutySchedules.get(id);
    if (!dutySchedule) {
      throw new NotFoundException('值班记录不存在');
    }
    return dutySchedule;
  }

  async findByDate(date: Date): Promise<IDutySchedule[]> {
    const dateStr = this.formatDate(date);
    const ids = this.dateIndex.get(dateStr) || [];
    return ids
      .map((id) => this.dutySchedules.get(id))
      .filter(Boolean)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  async getDutyByDate(date: Date): Promise<DutyScheduleByDateDto> {
    const duties = await this.findByDate(date);

    const result: DutyScheduleByDateDto = {
      date: new Date(date),
    };

    for (const duty of duties) {
      if (duty.shiftType === DutyShiftType.DAY) {
        result.dayShift = duty;
      } else if (duty.shiftType === DutyShiftType.NIGHT) {
        result.nightShift = duty;
      } else if (duty.shiftType === DutyShiftType.WEEKEND) {
        result.weekendShift = duty;
      }
    }

    return result;
  }

  async update(
    id: string,
    dto: UpdateDutyScheduleDto,
  ): Promise<IDutySchedule> {
    const dutySchedule = await this.findOne(id);

    Object.assign(dutySchedule, {
      ...dto,
      updatedAt: new Date(),
    });

    if (dto.startTime || dto.endTime || dto.roomId) {
      this.removeFromDateIndex(dutySchedule);
      this.addToDateIndex(dutySchedule);
    }

    return dutySchedule;
  }

  async remove(id: string): Promise<void> {
    const dutySchedule = await this.findOne(id);
    this.removeFromDateIndex(dutySchedule);
    this.dutySchedules.delete(id);
  }

  async requestSwap(
    id: string,
    dto: SwapDutyDto,
    requesterId: string,
  ): Promise<IDutySchedule> {
    const dutySchedule = await this.findOne(id);

    if (dutySchedule.counselorId !== requesterId) {
      throw new BadRequestException('只能申请自己的值班调班');
    }

    if (dutySchedule.swapRequested) {
      throw new BadRequestException('该值班已申请调班');
    }

    dutySchedule.swapRequested = true;
    dutySchedule.swapRequestedBy = dto.targetCounselorId;
    dutySchedule.swapRequestedAt = new Date();
    dutySchedule.updatedAt = new Date();

    return dutySchedule;
  }

  async confirmSwap(id: string, confirmerId: string): Promise<IDutySchedule> {
    const dutySchedule = await this.findOne(id);

    if (!dutySchedule.swapRequested) {
      throw new BadRequestException('该值班没有待确认的调班申请');
    }

    if (dutySchedule.swapRequestedBy !== confirmerId) {
      throw new BadRequestException('无权确认该调班申请');
    }

    const originalCounselorId = dutySchedule.counselorId;
    dutySchedule.counselorId = dutySchedule.swapRequestedBy || '';
    dutySchedule.counselorName = this.getCounselorName(dutySchedule.counselorId);
    dutySchedule.status = DutyStatus.SWAPPED;
    dutySchedule.swapRequested = false;
    dutySchedule.swapRequestedBy = undefined;
    dutySchedule.swapRequestedAt = undefined;
    dutySchedule.updatedAt = new Date();

    this.removeFromDateIndex(dutySchedule);
    this.addToDateIndex(dutySchedule);

    return dutySchedule;
  }

  async startDuty(id: string): Promise<IDutySchedule> {
    const dutySchedule = await this.findOne(id);
    if (dutySchedule.status !== DutyStatus.SCHEDULED) {
      throw new BadRequestException('只有待值班状态才能开始值班');
    }

    dutySchedule.status = DutyStatus.ON_DUTY;
    dutySchedule.updatedAt = new Date();

    return dutySchedule;
  }

  async endDuty(id: string): Promise<IDutySchedule> {
    const dutySchedule = await this.findOne(id);
    if (dutySchedule.status !== DutyStatus.ON_DUTY) {
      throw new BadRequestException('只有值班中状态才能结束值班');
    }

    dutySchedule.status = DutyStatus.COMPLETED;
    dutySchedule.updatedAt = new Date();

    return dutySchedule;
  }

  async getCurrentDutyCounselor(
    date?: Date,
  ): Promise<IDutySchedule | null> {
    const targetDate = date || new Date();
    const duties = await this.findByDate(targetDate);

    const now = new Date();
    const currentTime = this.formatTime(now);

    for (const duty of duties) {
      if (
        duty.startTime <= currentTime &&
        duty.endTime >= currentTime &&
        duty.status !== DutyStatus.CANCELLED
      ) {
        return duty;
      }
    }

    return null;
  }

  private findByDateAndCounselor(
    date: Date,
    counselorId: string,
  ): IDutySchedule[] {
    const duties = this.dutySchedules;
    const dateStr = this.formatDate(date);
    const ids = this.dateIndex.get(dateStr) || [];

    return ids
      .map((id) => duties.get(id))
      .filter((d) => d && d.counselorId === counselorId);
  }

  private addToDateIndex(duty: IDutySchedule) {
    const dateStr = this.formatDate(duty.date);
    const ids = this.dateIndex.get(dateStr) || [];
    if (!ids.includes(duty.id)) {
      ids.push(duty.id);
      this.dateIndex.set(dateStr, ids);
    }
  }

  private removeFromDateIndex(duty: IDutySchedule) {
    const dateStr = this.formatDate(duty.date);
    const ids = this.dateIndex.get(dateStr) || [];
    const index = ids.indexOf(duty.id);
    if (index > -1) {
      ids.splice(index, 1);
      if (ids.length > 0) {
        this.dateIndex.set(dateStr, ids);
      } else {
        this.dateIndex.delete(dateStr);
      }
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  private getCounselorName(counselorId: string): string {
    return `咨询师${counselorId}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
