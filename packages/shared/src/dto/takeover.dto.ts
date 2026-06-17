import { TakeoverReason } from "../enums";

export interface CreateTakeoverDto {
  crisisCaseId?: string;
  appointmentId?: string;
  studentId: string;
  takeoverCounselorId: string;
  reason: TakeoverReason;
  reasonDescription?: string;
  originalCounselorId?: string;
  notifyOriginalCounselor?: boolean;
  notifyStudent?: boolean;
  notifyMentor?: boolean;
}

export interface ReleaseTakeoverDto {
  reason: string;
  releasedBy: string;
  notifyStudent?: boolean;
  notifyOriginalCounselor?: boolean;
}

export interface TakeoverRecordResponseDto {
  id: string;
  crisisCaseId?: string;
  appointmentId?: string;
  studentId: string;
  studentName: string;
  originalCounselorId?: string;
  originalCounselorName?: string;
  takeoverCounselorId: string;
  takeoverCounselorName: string;
  reason: TakeoverReason;
  reasonDescription?: string;
  takenOverAt: Date;
  isActive: boolean;
  releasedAt?: Date;
  releasedBy?: string;
  releasedByName?: string;
  releaseReason?: string;
  createdAt: Date;
}

export interface TakeoverQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  crisisCaseId?: string;
  appointmentId?: string;
  takeoverCounselorId?: string;
  originalCounselorId?: string;
  reason?: TakeoverReason;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface BatchTakeoverDto {
  studentIds: string[];
  takeoverCounselorId: string;
  reason: TakeoverReason;
  reasonDescription?: string;
}

export interface TakeoverAppointmentCheckDto {
  appointmentId: string;
  studentId?: string;
}

export interface TakeoverCheckResultDto {
  isTakenOver: boolean;
  takeoverRecord?: TakeoverRecordResponseDto;
  studentCanCancel: boolean;
  reason?: string;
}
