import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateTakeoverDto,
  ReleaseTakeoverDto,
  TakeoverRecordResponseDto,
  TakeoverQueryDto,
  BatchTakeoverDto,
  TakeoverAppointmentCheckDto,
  TakeoverCheckResultDto,
} from '@shared/dto/takeover.dto';
import { ITakeoverRecord, IAppointment, ICrisisCase } from '@shared/interfaces';
import {
  TakeoverReason,
  AppointmentStatus,
  CrisisStatus,
  NotificationType,
  UserRole,
} from '@shared/enums';

@Injectable()
export class TakeoverService {
  private takeoverRecords: Map<string, ITakeoverRecord> = new Map();
  private activeTakeoversByStudent: Map<string, string> = new Map();
  private appointments: Map<string, IAppointment> = new Map();
  private crisisCases: Map<string, ICrisisCase> = new Map();

  constructor() {}

  async createTakeover(dto: CreateTakeoverDto): Promise<ITakeoverRecord> {
    const studentId = dto.studentId;
    const existingActiveTakeover = this.activeTakeoversByStudent.get(studentId);

    if (existingActiveTakeover) {
      const existing = this.takeoverRecords.get(existingActiveTakeover);
      if (existing && existing.takeoverCounselorId === dto.takeoverCounselorId) {
        throw new BadRequestException('该学生已由该咨询师接管');
      }
      if (existing && existing.isActive) {
        throw new BadRequestException('该学生已有有效的接管记录，请先释放');
      }
    }

    const takeover: ITakeoverRecord = {
      id: this.generateId(),
      crisisCaseId: dto.crisisCaseId,
      appointmentId: dto.appointmentId,
      studentId: dto.studentId,
      studentName: this.getStudentName(dto.studentId),
      originalCounselorId: dto.originalCounselorId,
      originalCounselorName: dto.originalCounselorId
        ? `咨询师${dto.originalCounselorId}`
        : undefined,
      takeoverCounselorId: dto.takeoverCounselorId,
      takeoverCounselorName: `咨询师${dto.takeoverCounselorId}`,
      reason: dto.reason,
      reasonDescription: dto.reasonDescription,
      takenOverAt: new Date(),
      isActive: true,
      createdAt: new Date(),
    };

    this.takeoverRecords.set(takeover.id, takeover);
    this.activeTakeoversByStudent.set(studentId, takeover.id);

    if (dto.appointmentId) {
      const appointment = this.appointments.get(dto.appointmentId);
      if (appointment) {
        appointment.takenOver = true;
        appointment.takenOverAt = new Date();
        appointment.takenOverBy = dto.takeoverCounselorId;
        appointment.takeoverReason = dto.reason;
        appointment.studentCannotCancel = true;
        appointment.status = AppointmentStatus.TAKEN_OVER;
        appointment.counselorId = dto.takeoverCounselorId;
      }
    }

    if (dto.crisisCaseId) {
      const crisisCase = this.crisisCases.get(dto.crisisCaseId);
      if (crisisCase) {
        crisisCase.isManualTakeover = true;
        crisisCase.takeoverCounselorId = dto.takeoverCounselorId;
        crisisCase.takeoverReason = dto.reason;
        crisisCase.takeoverAt = new Date();
        crisisCase.status = CrisisStatus.MANUAL_TAKEOVER;
      }
    }

    return takeover;
  }

  async releaseTakeover(
    id: string,
    dto: ReleaseTakeoverDto,
  ): Promise<ITakeoverRecord> {
    const takeover = this.takeoverRecords.get(id);
    if (!takeover) {
      throw new NotFoundException('接管记录不存在');
    }

    if (!takeover.isActive) {
      throw new BadRequestException('该接管记录已释放');
    }

    takeover.isActive = false;
    takeover.releasedAt = new Date();
    takeover.releasedBy = dto.releasedBy;
    takeover.releaseReason = dto.reason;

    this.activeTakeoversByStudent.delete(takeover.studentId);

    if (takeover.appointmentId) {
      const appointment = this.appointments.get(takeover.appointmentId);
      if (appointment) {
        appointment.studentCannotCancel = false;
        if (takeover.originalCounselorId) {
          appointment.counselorId = takeover.originalCounselorId;
        }
      }
    }

    return takeover;
  }

  async findAll(
    query: TakeoverQueryDto,
  ): Promise<{ items: ITakeoverRecord[]; total: number }> {
    let results = Array.from(this.takeoverRecords.values());

    if (query.studentId) {
      results = results.filter((t) => t.studentId === query.studentId);
    }
    if (query.crisisCaseId) {
      results = results.filter((t) => t.crisisCaseId === query.crisisCaseId);
    }
    if (query.appointmentId) {
      results = results.filter((t) => t.appointmentId === query.appointmentId);
    }
    if (query.takeoverCounselorId) {
      results = results.filter(
        (t) => t.takeoverCounselorId === query.takeoverCounselorId,
      );
    }
    if (query.originalCounselorId) {
      results = results.filter(
        (t) => t.originalCounselorId === query.originalCounselorId,
      );
    }
    if (query.reason) {
      results = results.filter((t) => t.reason === query.reason);
    }
    if (query.isActive !== undefined) {
      results = results.filter((t) => t.isActive === query.isActive);
    }
    if (query.startDate) {
      const start = new Date(query.startDate);
      results = results.filter((t) => new Date(t.takenOverAt) >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      results = results.filter((t) => new Date(t.takenOverAt) <= end);
    }

    results.sort(
      (a, b) =>
        new Date(b.takenOverAt).getTime() - new Date(a.takenOverAt).getTime(),
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

  async findOne(id: string): Promise<ITakeoverRecord> {
    const takeover = this.takeoverRecords.get(id);
    if (!takeover) {
      throw new NotFoundException('接管记录不存在');
    }
    return takeover;
  }

  async getActiveTakeoverByStudent(
    studentId: string,
  ): Promise<ITakeoverRecord | null> {
    const takeoverId = this.activeTakeoversByStudent.get(studentId);
    if (!takeoverId) return null;
    const takeover = this.takeoverRecords.get(takeoverId);
    return takeover && takeover.isActive ? takeover : null;
  }

  async checkAppointmentTakeover(
    dto: TakeoverAppointmentCheckDto,
  ): Promise<TakeoverCheckResultDto> {
    const { appointmentId, studentId } = dto;

    let takeover: ITakeoverRecord | undefined;

    if (appointmentId) {
      const appointment = this.appointments.get(appointmentId);
      if (appointment && appointment.takenOver) {
        const activeTakeover = await this.getActiveTakeoverByStudent(
          studentId || appointment.studentId,
        );
        takeover = activeTakeover || undefined;
      }
    }

    if (studentId && !takeover) {
      const active = await this.getActiveTakeoverByStudent(studentId);
      if (active) {
        takeover = active;
      }
    }

    const isTakenOver = !!takeover;
    const studentCanCancel = !isTakenOver;

    let reason = '';
    if (isTakenOver) {
      reason = '该个案已被人工接管，学生无法自行取消预约';
    }

    return {
      isTakenOver,
      takeoverRecord: takeover as any,
      studentCanCancel,
      reason: reason || undefined,
    };
  }

  async canStudentCancelAppointment(
    appointmentId: string,
    studentId: string,
  ): Promise<boolean> {
    const appointment = this.appointments.get(appointmentId);

    if (!appointment) {
      return true;
    }

    if (appointment.studentCannotCancel) {
      return false;
    }

    const activeTakeover = await this.getActiveTakeoverByStudent(studentId);
    if (activeTakeover && activeTakeover.appointmentId === appointmentId) {
      return false;
    }

    return true;
  }

  async validateStudentCancel(
    appointmentId: string,
    studentId: string,
  ): Promise<void> {
    const canCancel = await this.canStudentCancelAppointment(
      appointmentId,
      studentId,
    );

    if (!canCancel) {
      const activeTakeover = await this.getActiveTakeoverByStudent(studentId);
      if (activeTakeover) {
        throw new ForbiddenException(
          `该预约已由 ${activeTakeover.takeoverCounselorName} 接管（原因：${this.getTakeoverReasonText(activeTakeover.reason)}），学生无法自行取消，请联系管理员或接管咨询师`,
        );
      } else {
        throw new ForbiddenException('该预约不允许学生自行取消');
      }
    }
  }

  async batchTakeover(dto: BatchTakeoverDto): Promise<ITakeoverRecord[]> {
    const results: ITakeoverRecord[] = [];

    for (const studentId of dto.studentIds) {
      try {
        const result = await this.createTakeover({
          ...dto,
          studentId,
        });
        results.push(result);
      } catch (e) {
      }
    }

    return results;
  }

  private getTakeoverReasonText(reason: TakeoverReason): string {
    const reasonMap: Record<TakeoverReason, string> = {
      [TakeoverReason.HIGH_RISK]: '高风险个案',
      [TakeoverReason.CRITICAL_RISK]: '极高风险个案',
      [TakeoverReason.STUDENT_REQUEST]: '学生申请',
      [TakeoverReason.COUNSELOR_REFERRAL]: '咨询师转介',
      [TakeoverReason.ADMIN_ASSIGN]: '管理员指派',
      [TakeoverReason.MULTIPLE_CRISIS]: '多次危机事件',
      [TakeoverReason.NIGHT_EMERGENCY]: '夜间紧急情况',
    };
    return reasonMap[reason] || reason;
  }

  private getStudentName(studentId: string): string {
    return `学生${studentId}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  registerAppointment(appointment: IAppointment) {
    this.appointments.set(appointment.id, appointment);
  }

  registerCrisisCase(crisisCase: ICrisisCase) {
    this.crisisCases.set(crisisCase.id, crisisCase);
  }

  getTakeoverReasonForDisplay(reason: TakeoverReason): string {
    return this.getTakeoverReasonText(reason);
  }
}
