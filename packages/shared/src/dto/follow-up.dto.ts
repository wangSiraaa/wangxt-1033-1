import { FollowUpStatus, FollowUpType } from "../enums";

export interface CreateFollowUpDto {
  crisisCaseId: string;
  studentId: string;
  assigneeId: string;
  type: FollowUpType;
  scheduledDate: Date;
  scheduledTime?: string;
  followUpNumber: number;
  isMandatory?: boolean;
  notes?: string;
}

export interface UpdateFollowUpDto {
  type?: FollowUpType;
  status?: FollowUpStatus;
  scheduledDate?: Date;
  scheduledTime?: string;
  assigneeId?: string;
  result?: string;
  notes?: string;
  completedAt?: Date;
}

export interface FollowUpResponseDto {
  id: string;
  crisisCaseId: string;
  studentId: string;
  studentName: string;
  assigneeId: string;
  assigneeName: string;
  type: FollowUpType;
  status: FollowUpStatus;
  scheduledDate: Date;
  scheduledTime?: string;
  completedAt?: Date;
  result?: string;
  notes?: string;
  followUpNumber: number;
  isMandatory: boolean;
  isOverdue: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FollowUpQueryDto {
  page?: number;
  pageSize?: number;
  crisisCaseId?: string;
  studentId?: string;
  assigneeId?: string;
  status?: FollowUpStatus;
  type?: FollowUpType;
  startDate?: Date;
  endDate?: Date;
  isOverdue?: boolean;
  isMandatory?: boolean;
}

export interface CompleteFollowUpDto {
  result: string;
  notes?: string;
}

export interface BatchCreateFollowUpDto {
  crisisCaseId: string;
  studentId: string;
  followUps: Array<{
    type: FollowUpType;
    scheduledDate: Date;
    scheduledTime?: string;
    followUpNumber: number;
    assigneeId: string;
    isMandatory?: boolean;
  }>;
}

export interface FollowUpPlanDto {
  crisisCaseId: string;
  totalFollowUps: number;
  completedFollowUps: number;
  pendingFollowUps: number;
  overdueFollowUps: number;
  nextFollowUpDate?: Date;
  followUps: FollowUpResponseDto[];
}
