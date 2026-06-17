import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateGroupCounselingDto,
  UpdateGroupCounselingDto,
  GroupCounselingResponseDto,
  GroupCounselingQueryDto,
  JoinGroupCounselingDto,
  LeaveGroupCounselingDto,
  GroupMemberResponseDto,
  GroupMemberQueryDto,
  RecordAttendanceDto,
  GroupRoomConflictCheckDto,
  RoomConflictResultDto,
} from '@shared/dto/group-counseling.dto';
import {
  IGroupCounseling,
  IGroupCounselingMember,
  IAppointment,
} from '@shared/interfaces';
import {
  GroupCounselingStatus,
  GroupMemberStatus,
  RoomType,
  NotificationType,
} from '@shared/enums';

@Injectable()
export class GroupCounselingService {
  private groupCounselings: Map<string, IGroupCounseling> = new Map();
  private groupMembers: Map<string, IGroupCounselingMember[]> = new Map();
  private roomDateIndex: Map<string, string[]> = new Map();
  private appointments: Map<string, IAppointment> = new Map();

  constructor() {}

  async create(
    dto: CreateGroupCounselingDto,
    creatorId: string,
  ): Promise<IGroupCounseling> {
    const conflictCheck = await this.checkRoomConflict({
      roomId: dto.roomId,
      date: dto.startDate,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    if (conflictCheck.hasConflict) {
      throw new BadRequestException(
        `房间冲突：${conflictCheck.conflictReason}`,
      );
    }

    const group: IGroupCounseling = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      counselorId: dto.counselorId,
      counselorName: this.getCounselorName(dto.counselorId),
      coCounselorIds: dto.coCounselorIds,
      coCounselorNames: dto.coCounselorIds?.map((id) => `咨询师${id}`),
      roomId: dto.roomId,
      roomName: `房间${dto.roomId}`,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      startTime: dto.startTime,
      endTime: dto.endTime,
      totalSessions: dto.totalSessions,
      currentSession: 0,
      maxMembers: dto.maxMembers,
      minMembers: dto.minMembers || 0,
      status: GroupCounselingStatus.DRAFT,
      theme: dto.theme,
      targetPopulation: dto.targetPopulation,
      isConfidential: dto.isConfidential || false,
      registrationDeadline: dto.registrationDeadline
        ? new Date(dto.registrationDeadline)
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: creatorId,
    };

    this.groupCounselings.set(group.id, group);
    this.addRoomDateIndex(group);

    return group;
  }

  async findAll(
    query: GroupCounselingQueryDto,
  ): Promise<{ items: IGroupCounseling[]; total: number }> {
    let results = Array.from(this.groupCounselings.values());

    if (query.counselorId) {
      results = results.filter((g) => g.counselorId === query.counselorId);
    }
    if (query.status) {
      results = results.filter((g) => g.status === query.status);
    }
    if (query.theme) {
      results = results.filter((g) => g.theme === query.theme);
    }
    if (query.isConfidential !== undefined) {
      results = results.filter((g) => g.isConfidential === query.isConfidential);
    }
    if (query.startDate) {
      const start = new Date(query.startDate);
      results = results.filter((g) => new Date(g.endDate) >= start);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      results = results.filter((g) => new Date(g.startDate) <= end);
    }
    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      results = results.filter(
        (g) =>
          g.title.toLowerCase().includes(kw) ||
          g.description.toLowerCase().includes(kw),
      );
    }

    results.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = results.slice(start, start + pageSize);

    const itemsWithMemberCount = paginated.map((g) => ({
      ...g,
      memberCount: (this.groupMembers.get(g.id) || []).length,
    }));

    return {
      items: itemsWithMemberCount as any[],
      total: results.length,
    };
  }

  async findOne(id: string): Promise<IGroupCounseling & { memberCount: number }> {
    const group = this.groupCounselings.get(id);
    if (!group) {
      throw new NotFoundException('团体咨询不存在');
    }

    const members = this.groupMembers.get(id) || [];
    return {
      ...group,
      memberCount: members.length,
    };
  }

  async update(
    id: string,
    dto: UpdateGroupCounselingDto,
  ): Promise<IGroupCounseling> {
    const group = await this.findOne(id);

    if (
      dto.roomId ||
      dto.startDate ||
      dto.endDate ||
      dto.startTime ||
      dto.endTime
    ) {
      this.removeRoomDateIndex(group);
    }

    Object.assign(group, {
      ...dto,
      updatedAt: new Date(),
    });

    if (
      dto.roomId ||
      dto.startDate ||
      dto.endDate ||
      dto.startTime ||
      dto.endTime
    ) {
      this.addRoomDateIndex(group);
    }

    return group;
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    this.removeRoomDateIndex(group);
    this.groupCounselings.delete(id);
    this.groupMembers.delete(id);
  }

  async publish(id: string): Promise<IGroupCounseling> {
    const group = await this.findOne(id);
    if (group.status !== GroupCounselingStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态才能发布');
    }

    group.status = GroupCounselingStatus.REGISTERING;
    group.updatedAt = new Date();

    return group;
  }

  async join(
    id: string,
    dto: JoinGroupCounselingDto,
  ): Promise<IGroupCounselingMember> {
    const group = await this.findOne(id);

    if (
      group.status !== GroupCounselingStatus.REGISTERING &&
      group.status !== GroupCounselingStatus.PUBLISHED
    ) {
      throw new BadRequestException('该团体咨询不在报名期');
    }

    const members = this.groupMembers.get(id) || [];
    const existingMember = members.find(
      (m) => m.studentId === dto.studentId,
    );

    if (existingMember && existingMember.status !== GroupMemberStatus.DROPPED) {
      throw new BadRequestException('您已报名该团体咨询');
    }

    if (members.length >= group.maxMembers) {
      throw new BadRequestException('团体咨询人数已满');
    }

    if (group.registrationDeadline) {
      const now = new Date();
      if (now > new Date(group.registrationDeadline)) {
        throw new BadRequestException('报名已截止');
      }
    }

    const member: IGroupCounselingMember = {
      id: this.generateId(),
      groupCounselingId: id,
      studentId: dto.studentId,
      studentName: this.getStudentName(dto.studentId),
      status: GroupMemberStatus.REGISTERED,
      joinedAt: new Date(),
      attendanceCount: 0,
      sessionAttendance: {},
      notes: dto.notes,
      createdAt: new Date(),
    };

    members.push(member);
    this.groupMembers.set(id, members);

    if (members.length >= group.maxMembers) {
      group.status = GroupCounselingStatus.FULL;
      group.updatedAt = new Date();
    }

    return member;
  }

  async leave(
    id: string,
    memberId: string,
    dto: LeaveGroupCounselingDto,
  ): Promise<IGroupCounselingMember> {
    const members = this.groupMembers.get(id) || [];
    const member = members.find((m) => m.id === memberId);

    if (!member) {
      throw new NotFoundException('成员不存在');
    }

    if (member.status === GroupMemberStatus.DROPPED) {
      throw new BadRequestException('成员已退出');
    }

    member.status = GroupMemberStatus.DROPPED;
    member.leftAt = new Date();
    member.leaveReason = dto.reason;

    const group = await this.findOne(id);
    if (group.status === GroupCounselingStatus.FULL) {
      group.status = GroupCounselingStatus.REGISTERING;
      group.updatedAt = new Date();
    }

    return member;
  }

  async getMembers(
    groupId: string,
    query: GroupMemberQueryDto,
  ): Promise<{ items: IGroupCounselingMember[]; total: number }> {
    let members = this.groupMembers.get(groupId) || [];

    if (query.status) {
      members = members.filter((m) => m.status === query.status);
    }
    if (query.studentId) {
      members = members.filter((m) => m.studentId === query.studentId);
    }

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginated = members.slice(start, start + pageSize);

    return {
      items: paginated,
      total: members.length,
    };
  }

  async recordAttendance(
    groupId: string,
    dto: RecordAttendanceDto,
  ): Promise<void> {
    const members = this.groupMembers.get(groupId) || [];

    for (const attendance of dto.attendances) {
      const member = members.find((m) => m.id === attendance.memberId);
      if (member) {
        member.sessionAttendance[dto.sessionNumber.toString()] =
          attendance.attended;
        if (attendance.attended) {
          member.attendanceCount++;
          member.status = GroupMemberStatus.ATTENDED;
        } else {
          member.status = GroupMemberStatus.ABSENT;
        }
      }
    }

    const group = await this.findOne(groupId);
    group.currentSession = dto.sessionNumber;
    group.updatedAt = new Date();
  }

  async checkRoomConflict(
    dto: GroupRoomConflictCheckDto,
    excludeGroupId?: string,
  ): Promise<RoomConflictResultDto> {
    const { roomId, date, startTime, endTime } = dto;
    const dateStr = this.formatDate(date);
    const roomDateKey = `${roomId}_${dateStr}`;

    const groupIds = this.roomDateIndex.get(roomDateKey) || [];
    const conflictingGroups: IGroupCounseling[] = [];

    for (const groupId of groupIds) {
      if (excludeGroupId && groupId === excludeGroupId) {
        continue;
      }

      const group = this.groupCounselings.get(groupId);
      if (!group) continue;

      if (this.isTimeOverlap(startTime, endTime, group.startTime, group.endTime)) {
        if (
          group.status !== GroupCounselingStatus.CANCELLED &&
          group.status !== GroupCounselingStatus.DRAFT
        ) {
          conflictingGroups.push(group);
        }
      }
    }

    const conflictingAppointments: IAppointment[] = [];
    for (const appointment of this.appointments.values()) {
      if (appointment.roomId !== roomId) continue;
      if (this.formatDate(appointment.date) !== dateStr) continue;
      if (appointment.status === 'cancelled' || appointment.status === 'completed')
        continue;

      if (
        this.isTimeOverlap(
          startTime,
          endTime,
          appointment.startTime,
          appointment.endTime,
        )
      ) {
        conflictingAppointments.push(appointment);
      }
    }

    const hasConflict =
      conflictingGroups.length > 0 || conflictingAppointments.length > 0;

    let conflictReason = '';
    if (conflictingGroups.length > 0) {
      conflictReason += `与 ${conflictingGroups.length} 个团体咨询冲突；`;
    }
    if (conflictingAppointments.length > 0) {
      conflictReason += `与 ${conflictingAppointments.length} 个预约冲突；`;
    }

    return {
      hasConflict,
      conflictingGroups: conflictingGroups as any,
      conflictingAppointments: conflictingAppointments as any,
      conflictReason: conflictReason || undefined,
    };
  }

  async checkRoomConflictForReschedule(
    roomId: string,
    date: Date,
    startTime: string,
    endTime: string,
    appointmentId?: string,
  ): Promise<boolean> {
    const result = await this.checkRoomConflict({
      roomId,
      date,
      startTime,
      endTime,
    });

    if (result.hasConflict) {
      const hasGroupConflict =
        result.conflictingGroups && result.conflictingGroups.length > 0;
      if (hasGroupConflict) {
        const confidentialGroups = result.conflictingGroups.filter(
          (g) => g.isConfidential,
        );
        if (confidentialGroups.length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  async startGroup(id: string): Promise<IGroupCounseling> {
    const group = await this.findOne(id);
    if (
      group.status !== GroupCounselingStatus.REGISTERING &&
      group.status !== GroupCounselingStatus.FULL
    ) {
      throw new BadRequestException('该团体咨询无法开始');
    }

    group.status = GroupCounselingStatus.IN_PROGRESS;
    group.updatedAt = new Date();

    return group;
  }

  async completeGroup(id: string): Promise<IGroupCounseling> {
    const group = await this.findOne(id);
    if (group.status !== GroupCounselingStatus.IN_PROGRESS) {
      throw new BadRequestException('该团体咨询无法结束');
    }

    group.status = GroupCounselingStatus.COMPLETED;
    group.updatedAt = new Date();

    return group;
  }

  async cancelGroup(id: string, reason: string): Promise<IGroupCounseling> {
    const group = await this.findOne(id);
    if (group.status === GroupCounselingStatus.COMPLETED) {
      throw new BadRequestException('已完成的团体咨询无法取消');
    }

    group.status = GroupCounselingStatus.CANCELLED;
    group.updatedAt = new Date();

    return group;
  }

  private isTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  private addRoomDateIndex(group: IGroupCounseling) {
    const startDate = new Date(group.startDate);
    const endDate = new Date(group.endDate);
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = this.formatDate(current);
      const key = `${group.roomId}_${dateStr}`;
      const ids = this.roomDateIndex.get(key) || [];
      if (!ids.includes(group.id)) {
        ids.push(group.id);
        this.roomDateIndex.set(key, ids);
      }
      current.setDate(current.getDate() + 1);
    }
  }

  private removeRoomDateIndex(group: IGroupCounseling) {
    const startDate = new Date(group.startDate);
    const endDate = new Date(group.endDate);
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = this.formatDate(current);
      const key = `${group.roomId}_${dateStr}`;
      const ids = this.roomDateIndex.get(key) || [];
      const index = ids.indexOf(group.id);
      if (index > -1) {
        ids.splice(index, 1);
        if (ids.length > 0) {
          this.roomDateIndex.set(key, ids);
        } else {
          this.roomDateIndex.delete(key);
        }
      }
      current.setDate(current.getDate() + 1);
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private getCounselorName(counselorId: string): string {
    return `咨询师${counselorId}`;
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
}
