import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateDailyTrackingDto,
  UpdateDailyTrackingDto,
  DailyTrackingResponseDto,
  DailyTrackingQueryDto,
  DailyTrackingSummaryDto,
  MarkTrackingCompleteDto,
  BulkTrackingReminderDto,
} from '@shared/dto/daily-tracking.dto';
import { IDailyTrackingRecord, ICrisisCase } from '@shared/interfaces';
import {
  DailyTrackingStatus,
  TrackingRecordType,
  NotificationType,
  CrisisStatus,
} from '@shared/enums';

@Injectable()
export class DailyTrackingService {
  private trackingRecords: Map<string, IDailyTrackingRecord> = new Map();
  private crisisCaseTrackings: Map<string, string[]> = new Map();
  private crisisCases: Map<string, ICrisisCase> = new Map();

  constructor() {}

  async create(
    dto: CreateDailyTrackingDto,
    trackerId: string,
    trackerName: string,
  ): Promise<IDailyTrackingRecord> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingToday = this.getTrackingByDate(dto.crisisCaseId, today);
    if (existingToday && dto.recordType === TrackingRecordType.DAILY_CHECK) {
      throw new BadRequestException('今日已完成日常追踪记录');
    }

    const record: IDailyTrackingRecord = {
      id: this.generateId(),
      crisisCaseId: dto.crisisCaseId,
      studentId: dto.studentId,
      studentName: this.getStudentName(dto.studentId),
      trackerId,
      trackerName,
      trackingDate: new Date(),
      status: DailyTrackingStatus.TRACKED,
      recordType: dto.recordType,
      content: dto.content,
      moodLevel: dto.moodLevel,
      sleepStatus: dto.sleepStatus,
      appetiteStatus: dto.appetiteStatus,
      isStable: dto.isStable,
      needsFollowUp: dto.needsFollowUp || false,
      nextAction: dto.nextAction,
      attachments: dto.attachments,
      createdAt: new Date(),
    };

    this.trackingRecords.set(record.id, record);
    this.addToCrisisCaseIndex(dto.crisisCaseId, record.id);

    this.updateCrisisCaseTrackingInfo(dto.crisisCaseId, record);

    return record;
  }

  async findAll(
    query: DailyTrackingQueryDto,
  ): Promise<{ items: IDailyTrackingRecord[]; total: number }> {
    let results = Array.from(this.trackingRecords.values());

    if (query.crisisCaseId) {
      const ids = this.crisisCaseTrackings.get(query.crisisCaseId) || [];
      results = results.filter((r) => ids.includes(r.id));
    }
    if (query.studentId) {
      results = results.filter((r) => r.studentId === query.studentId);
    }
    if (query.trackerId) {
      results = results.filter((r) => r.trackerId === query.trackerId);
    }
    if (query.status) {
      results = results.filter((r) => r.status === query.status);
    }
    if (query.recordType) {
      results = results.filter((r) => r.recordType === query.recordType);
    }
    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      results = results.filter((r) => new Date(r.trackingDate) >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      results = results.filter((r) => new Date(r.trackingDate) <= end);
    }

    results.sort(
      (a, b) =>
        new Date(b.trackingDate).getTime() - new Date(a.trackingDate).getTime(),
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

  async findOne(id: string): Promise<IDailyTrackingRecord> {
    const record = this.trackingRecords.get(id);
    if (!record) {
      throw new NotFoundException('追踪记录不存在');
    }
    return record;
  }

  async update(
    id: string,
    dto: UpdateDailyTrackingDto,
  ): Promise<IDailyTrackingRecord> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return record;
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    this.removeFromCrisisCaseIndex(record.crisisCaseId, id);
    this.trackingRecords.delete(id);
  }

  async markComplete(
    id: string,
    dto: MarkTrackingCompleteDto,
  ): Promise<IDailyTrackingRecord> {
    const record = await this.findOne(id);
    record.status = dto.status;
    if (dto.notes) {
      record.content += `\n\n备注：${dto.notes}`;
    }
    return record;
  }

  async getSummary(
    crisisCaseId: string,
  ): Promise<DailyTrackingSummaryDto> {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) {
      throw new NotFoundException('危机个案不存在');
    }

    const records = this.getCrisisCaseTrackings(crisisCaseId);
    const latest = records.length > 0 ? records[0] : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastTrackingDate = latest
      ? new Date(latest.trackingDate)
      : null;
    const isTodayTracked =
      lastTrackingDate && lastTrackingDate >= today ? true : false;

    let consecutiveStableDays = 0;
    for (const record of records) {
      if (record.isStable) {
        consecutiveStableDays++;
      } else {
        break;
      }
    }

    const nextTrackingDate = new Date(
      (latest ? new Date(latest.trackingDate) : today).getTime() +
        24 * 60 * 60 * 1000,
    );
    nextTrackingDate.setHours(0, 0, 0, 0);

    const pendingTrackings = isTodayTracked ? 0 : 1;
    const needsAttention =
      !isTodayTracked ||
      (latest && !latest.isStable) ||
      (latest && latest.needsFollowUp);

    return {
      crisisCaseId,
      studentId: crisisCase.studentId,
      studentName: this.getStudentName(crisisCase.studentId),
      totalTrackingDays: records.length,
      lastTrackingDate: lastTrackingDate || undefined,
      nextTrackingDate: nextTrackingDate,
      consecutiveStableDays,
      needsAttention: !!needsAttention,
      pendingTrackings,
      latestTracking: latest || undefined,
    };
  }

  async getPendingTrackings(): Promise<{
    pendingCases: ICrisisCase[];
    overdueCases: ICrisisCase[];
  }> {
    const pendingCases: ICrisisCase[] = [];
    const overdueCases: ICrisisCase[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const crisisCase of this.crisisCases.values()) {
      if (
        crisisCase.isTrackingClosed ||
        crisisCase.status === CrisisStatus.RESOLVED
      ) {
        continue;
      }

      const records = this.getCrisisCaseTrackings(crisisCase.id);
      const latest = records.length > 0 ? records[0] : null;
      const lastTrackingDate = latest
        ? new Date(latest.trackingDate)
        : null;

      const isTrackedToday =
        lastTrackingDate && lastTrackingDate >= today ? true : false;

      if (!isTrackedToday) {
        pendingCases.push(crisisCase);

        if (
          lastTrackingDate &&
          today.getTime() - lastTrackingDate.getTime() >
            24 * 60 * 60 * 1000
        ) {
          overdueCases.push(crisisCase);
        }
      }
    }

    return { pendingCases, overdueCases };
  }

  async sendBulkReminders(dto: BulkTrackingReminderDto): Promise<{
    sent: number;
    crisisCases: string[];
  }> {
    const { pendingCases, overdueCases } = await this.getPendingTrackings();

    let targetCases: ICrisisCase[] = [];
    switch (dto.reminderType) {
      case 'daily':
        targetCases = pendingCases;
        break;
      case 'overdue':
        targetCases = overdueCases;
        break;
      case 'weekly':
        targetCases = pendingCases;
        break;
      default:
        targetCases = pendingCases;
    }

    if (dto.crisisCaseIds) {
      targetCases = targetCases.filter((c) =>
        dto.crisisCaseIds!.includes(c.id),
      );
    }

    const sent = targetCases.length;
    const caseIds = targetCases.map((c) => c.id);

    return { sent, crisisCases: caseIds };
  }

  private getTrackingByDate(
    crisisCaseId: string,
    date: Date,
  ): IDailyTrackingRecord | null {
    const records = this.getCrisisCaseTrackings(crisisCaseId);
    const dateStr = this.formatDate(date);

    for (const record of records) {
      if (this.formatDate(record.trackingDate) === dateStr) {
        if (record.recordType === TrackingRecordType.DAILY_CHECK) {
          return record;
        }
      }
    }

    return null;
  }

  private getCrisisCaseTrackings(
    crisisCaseId: string,
  ): IDailyTrackingRecord[] {
    const ids = this.crisisCaseTrackings.get(crisisCaseId) || [];
    return ids
      .map((id) => this.trackingRecords.get(id))
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(b!.trackingDate).getTime() -
          new Date(a!.trackingDate).getTime(),
      ) as IDailyTrackingRecord[];
  }

  private addToCrisisCaseIndex(crisisCaseId: string, recordId: string) {
    const ids = this.crisisCaseTrackings.get(crisisCaseId) || [];
    if (!ids.includes(recordId)) {
      ids.push(recordId);
      this.crisisCaseTrackings.set(crisisCaseId, ids);
    }
  }

  private removeFromCrisisCaseIndex(crisisCaseId: string, recordId: string) {
    const ids = this.crisisCaseTrackings.get(crisisCaseId) || [];
    const index = ids.indexOf(recordId);
    if (index > -1) {
      ids.splice(index, 1);
      if (ids.length > 0) {
        this.crisisCaseTrackings.set(crisisCaseId, ids);
      } else {
        this.crisisCaseTrackings.delete(crisisCaseId);
      }
    }
  }

  private updateCrisisCaseTrackingInfo(
    crisisCaseId: string,
    record: IDailyTrackingRecord,
  ) {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (crisisCase) {
      crisisCase.trackingCount++;
      crisisCase.lastTrackingDate = record.trackingDate;

      const nextDate = new Date(record.trackingDate);
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(9, 0, 0, 0);
      crisisCase.nextTrackingDate = nextDate;
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private getStudentName(studentId: string): string {
    return `学生${studentId}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  registerCrisisCase(crisisCase: ICrisisCase) {
    this.crisisCases.set(crisisCase.id, crisisCase);
  }
}
