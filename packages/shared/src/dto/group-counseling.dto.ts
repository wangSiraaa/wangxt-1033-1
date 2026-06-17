import { GroupCounselingStatus, GroupMemberStatus } from "../enums";

export interface CreateGroupCounselingDto {
  title: string;
  description: string;
  counselorId: string;
  coCounselorIds?: string[];
  roomId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  totalSessions: number;
  maxMembers: number;
  minMembers?: number;
  theme?: string;
  targetPopulation?: string;
  isConfidential?: boolean;
  registrationDeadline?: Date;
}

export interface UpdateGroupCounselingDto {
  title?: string;
  description?: string;
  counselorId?: string;
  coCounselorIds?: string[];
  roomId?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  totalSessions?: number;
  maxMembers?: number;
  minMembers?: number;
  status?: GroupCounselingStatus;
  theme?: string;
  targetPopulation?: string;
  isConfidential?: boolean;
  registrationDeadline?: Date;
  currentSession?: number;
}

export interface GroupCounselingResponseDto {
  id: string;
  title: string;
  description: string;
  counselorId: string;
  counselorName: string;
  coCounselorIds?: string[];
  coCounselorNames?: string[];
  roomId: string;
  roomName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  totalSessions: number;
  currentSession: number;
  maxMembers: number;
  minMembers: number;
  memberCount: number;
  status: GroupCounselingStatus;
  theme?: string;
  targetPopulation?: string;
  isConfidential: boolean;
  registrationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupCounselingQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  status?: GroupCounselingStatus;
  startDate?: Date;
  endDate?: Date;
  theme?: string;
  isConfidential?: boolean;
  keyword?: string;
}

export interface JoinGroupCounselingDto {
  studentId: string;
  notes?: string;
}

export interface LeaveGroupCounselingDto {
  reason: string;
}

export interface UpdateGroupMemberStatusDto {
  status: GroupMemberStatus;
  sessionNumber?: number;
  attended?: boolean;
}

export interface GroupMemberResponseDto {
  id: string;
  groupCounselingId: string;
  studentId: string;
  studentName: string;
  status: GroupMemberStatus;
  joinedAt: Date;
  leftAt?: Date;
  leaveReason?: string;
  attendanceCount: number;
  notes?: string;
}

export interface GroupMemberQueryDto {
  page?: number;
  pageSize?: number;
  groupCounselingId?: string;
  studentId?: string;
  status?: GroupMemberStatus;
}

export interface RecordAttendanceDto {
  sessionNumber: number;
  attendances: Array<{
    memberId: string;
    attended: boolean;
    notes?: string;
  }>;
}

export interface GroupRoomConflictCheckDto {
  roomId: string;
  date: Date;
  startTime: string;
  endTime: string;
  excludeGroupId?: string;
}

export interface RoomConflictResultDto {
  hasConflict: boolean;
  conflictingGroups?: GroupCounselingResponseDto[];
  conflictingAppointments?: any[];
  conflictReason?: string;
}
