import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateFollowUpDto,
  UpdateFollowUpDto,
  FollowUpResponseDto,
  FollowUpQueryDto,
  CompleteFollowUpDto,
  BatchCreateFollowUpDto,
  FollowUpPlanDto,
} from '@shared/dto/follow-up.dto';
import { IFollowUp, ICrisisCase } from '@shared/interfaces';
import {
  FollowUpStatus,
  FollowUpType,
  NotificationType,
} from '@shared/enums';

@Injectable()
export class FollowUpService {
  private followUps: Map<string, IFollowUp> = new Map();
  private crisisCaseFollowUps: Map<string, string[]> = new Map();
  private crisisCases: Map<string, ICrisisCase> = new Map();

  constructor() {}

  async create(dto: CreateFollowUpDto): Promise<IFollowUp> {
    const followUp: IFollowUp = {
      id: this.generateId(),
      crisisCaseId: dto.crisisCaseId,
      studentId: dto.studentId,
      studentName: this.getStudentName(dto.studentId),
      assigneeId: dto.assigneeId,
      assigneeName: this.getCounselorName(dto.assigneeId),
      type: dto.type,
      status: FollowUpStatus.PENDING,
      scheduledDate: new Date(dto.scheduledDate),
      scheduledTime: dto.scheduledTime,
      followUpNumber: dto.followUpNumber,
      isMandatory: dto.isMandatory || false,
      notes: dto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.followUps.set(followUp.id, followUp);
    this.addToCrisisCaseIndex(dto.crisisCaseId, followUp.id);

    return followUp;
  }

  async batchCreate(dto: BatchCreateFollowUpDto): Promise<IFollowUp[]> {
    const results: IFollowUp[] = [];

    for (const followUpDto of dto.followUps) {
      try {
        const result = await this.create({
          ...followUpDto,
          crisisCaseId: dto.crisisCaseId,
          studentId: dto.studentId,
        });
        results.push(result);
      } catch (e) {
      }
    }

    return results;
  }

  async findAll(
    query: FollowUpQueryDto,
  ): Promise<{ items: IFollowUp[]; total: number }> {
    let results = Array.from(this.followUps.values());

    if (query.crisisCaseId) {
      const ids = this.crisisCaseFollowUps.get(query.crisisCaseId) || [];
      results = results.filter((f) => ids.includes(f.id));
    }
    if (query.studentId) {
      results = results.filter((f) => f.studentId === query.studentId);
    }
    if (query.assigneeId) {
      results = results.filter((f) => f.assigneeId === query.assigneeId);
    }
    if (query.status) {
      results = results.filter((f) => f.status === query.status);
    }
    if (query.type) {
      results = results.filter((f) => f.type === query.type);
    }
    if (query.isOverdue !== undefined) {
      const now = new Date();
      results = results.filter((f) => {
        const isOverdue =
          f.status !== FollowUpStatus.COMPLETED &&
          f.status !== FollowUpStatus.SKIPPED &&
          new Date(f.scheduledDate) < now;
        return query.isOverdue ? isOverdue : !isOverdue;
      });
    }
    if (query.isMandatory !== undefined) {
      results = results.filter((f) => f.isMandatory === query.isMandatory);
    }
    if (query.startDate) {
      const start = new Date(query.startDate);
      results = results.filter((f) => new Date(f.scheduledDate) >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      results = results.filter((f) => new Date(f.scheduledDate) <= end);
    }

    results.sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    const itemsWithOverdue = paginated.map((f) => ({
      ...f,
      isOverdue: this.checkIsOverdue(f),
    }));

    return {
      items: itemsWithOverdue as IFollowUp[],
      total: results.length,
    };
  }

  async findOne(id: string): Promise<IFollowUp> {
    const followUp = this.followUps.get(id);
    if (!followUp) {
      throw new NotFoundException('回访记录不存在');
    }
    return {
      ...followUp,
      isOverdue: this.checkIsOverdue(followUp),
    } as IFollowUp;
  }

  async update(
    id: string,
    dto: UpdateFollowUpDto,
  ): Promise<IFollowUp> {
    const followUp = await this.findOne(id);
    Object.assign(followUp, {
      ...dto,
      updatedAt: new Date(),
    });
    return followUp;
  }

  async remove(id: string): Promise<void> {
    const followUp = await this.findOne(id);
    this.removeFromCrisisCaseIndex(followUp.crisisCaseId, id);
    this.followUps.delete(id);
  }

  async complete(
    id: string,
    dto: CompleteFollowUpDto,
  ): Promise<IFollowUp> {
    const followUp = await this.findOne(id);

    if (
      followUp.status === FollowUpStatus.COMPLETED ||
      followUp.status === FollowUpStatus.SKIPPED
    ) {
      throw new BadRequestException('该回访已处理完成');
    }

    followUp.status = FollowUpStatus.COMPLETED;
    followUp.result = dto.result;
    followUp.notes = dto.notes
      ? (followUp.notes || '') + '\n\n' + dto.notes
      : followUp.notes;
    followUp.completedAt = new Date();
    followUp.updatedAt = new Date();

    return followUp;
  }

  async skip(id: string, reason: string): Promise<IFollowUp> {
    const followUp = await this.findOne(id);

    if (
      followUp.status === FollowUpStatus.COMPLETED ||
      followUp.status === FollowUpStatus.SKIPPED
    ) {
      throw new BadRequestException('该回访已处理完成');
    }

    if (followUp.isMandatory) {
      throw new BadRequestException('强制回访不允许跳过');
    }

    followUp.status = FollowUpStatus.SKIPPED;
    followUp.notes = reason
      ? (followUp.notes || '') + `\n\n跳过原因：${reason}`
      : followUp.notes;
    followUp.updatedAt = new Date();

    return followUp;
  }

  async startFollowUp(id: string): Promise<IFollowUp> {
    const followUp = await this.findOne(id);

    if (followUp.status !== FollowUpStatus.PENDING) {
      throw new BadRequestException('只有待处理状态的回访才能开始');
    }

    followUp.status = FollowUpStatus.IN_PROGRESS;
    followUp.updatedAt = new Date();

    return followUp;
  }

  async getFollowUpPlan(crisisCaseId: string): Promise<FollowUpPlanDto> {
    const crisisCase = this.crisisCases.get(crisisCaseId);
    if (!crisisCase) {
      throw new NotFoundException('危机个案不存在');
    }

    const followUps = this.getCrisisCaseFollowUps(crisisCaseId);
    const now = new Date();

    let completedCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let nextFollowUpDate: Date | undefined;

    for (const f of followUps) {
      if (
        f.status === FollowUpStatus.COMPLETED ||
        f.status === FollowUpStatus.SKIPPED
      ) {
        completedCount++;
      } else {
        pendingCount++;

        if (this.checkIsOverdue(f)) {
          overdueCount++;
        }

        if (
          !nextFollowUpDate ||
          new Date(f.scheduledDate) < nextFollowUpDate
        ) {
          nextFollowUpDate = new Date(f.scheduledDate);
        }
      }
    }

    const followUpsWithOverdue = followUps.map((f) => ({
      ...f,
      isOverdue: this.checkIsOverdue(f),
    }));

    return {
      crisisCaseId,
      totalFollowUps: followUps.length,
      completedFollowUps: completedCount,
      pendingFollowUps: pendingCount,
      overdueFollowUps: overdueCount,
      nextFollowUpDate,
      followUps: followUpsWithOverdue as IFollowUp[],
    };
  }

  async getMyFollowUps(
    assigneeId: string,
    query: Omit<FollowUpQueryDto, 'assigneeId'>,
  ): Promise<{ items: IFollowUp[]; total: number }> {
    return this.findAll({
      ...query,
      assigneeId,
    });
  }

  private checkIsOverdue(followUp: IFollowUp): boolean {
    if (
      followUp.status === FollowUpStatus.COMPLETED ||
      followUp.status === FollowUpStatus.SKIPPED
    ) {
      return false;
    }

    const now = new Date();
    const scheduled = new Date(followUp.scheduledDate);

    if (followUp.scheduledTime) {
      const [hours, minutes] = followUp.scheduledTime.split(':').map(Number);
      scheduled.setHours(hours, minutes, 0, 0);
    } else {
      scheduled.setHours(23, 59, 59, 999);
    }

    return now > scheduled;
  }

  private getCrisisCaseFollowUps(crisisCaseId: string): IFollowUp[] {
    const ids = this.crisisCaseFollowUps.get(crisisCaseId) || [];
    return ids
      .map((id) => this.followUps.get(id))
      .filter(Boolean)
      .sort(
        (a, b) =>
          new Date(a!.scheduledDate).getTime() -
          new Date(b!.scheduledDate).getTime(),
      ) as IFollowUp[];
  }

  private addToCrisisCaseIndex(crisisCaseId: string, followUpId: string) {
    const ids = this.crisisCaseFollowUps.get(crisisCaseId) || [];
    if (!ids.includes(followUpId)) {
      ids.push(followUpId);
      this.crisisCaseFollowUps.set(crisisCaseId, ids);
    }
  }

  private removeFromCrisisCaseIndex(
    crisisCaseId: string,
    followUpId: string,
  ) {
    const ids = this.crisisCaseFollowUps.get(crisisCaseId) || [];
    const index = ids.indexOf(followUpId);
    if (index > -1) {
      ids.splice(index, 1);
      if (ids.length > 0) {
        this.crisisCaseFollowUps.set(crisisCaseId, ids);
      } else {
        this.crisisCaseFollowUps.delete(crisisCaseId);
      }
    }
  }

  private getStudentName(studentId: string): string {
    return `学生${studentId}`;
  }

  private getCounselorName(counselorId: string): string {
    return `咨询师${counselorId}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  registerCrisisCase(crisisCase: ICrisisCase) {
    this.crisisCases.set(crisisCase.id, crisisCase);
  }
}
