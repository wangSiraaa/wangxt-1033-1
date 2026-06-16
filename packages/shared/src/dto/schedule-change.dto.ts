import { ScheduleChangeType } from "../enums";

export interface CreateScheduleChangeDto {
  scheduleId: string;
  changeType: ScheduleChangeType;
  reason: string;
  oldStartTime?: string;
  oldEndTime?: string;
  newStartTime?: string;
  newEndTime?: string;
  oldRoomId?: string;
  newRoomId?: string;
  swapWithScheduleId?: string;
}

export interface ScheduleChangeResponseDto {
  id: string;
  scheduleId: string;
  counselorId: string;
  counselorName: string;
  changeType: ScheduleChangeType;
  reason: string;
  oldStartTime?: string;
  oldEndTime?: string;
  newStartTime?: string;
  newEndTime?: string;
  oldRoomId?: string;
  oldRoomName?: string;
  newRoomId?: string;
  newRoomName?: string;
  swapWithScheduleId?: string;
  approvedBy?: string;
  approvedByName?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleChangeQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  changeType?: ScheduleChangeType;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ApproveScheduleChangeDto {
  approved: boolean;
  comment?: string;
}
