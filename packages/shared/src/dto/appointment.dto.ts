import { AppointmentStatus } from "../enums";

export interface CreateAppointmentDto {
  counselorId: string;
  scheduleId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: string;
  reason?: string;
  isOnline: boolean;
  roomId?: string;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  notes?: string;
  cancelReason?: string;
}

export interface AppointmentResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  scheduleId: string;
  roomId?: string;
  roomName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: string;
  reason?: string;
  notes?: string;
  isOnline: boolean;
  onlineLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  counselorId?: string;
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  type?: string;
}

export interface CancelAppointmentDto {
  reason?: string;
}

export interface RescheduleAppointmentDto {
  newScheduleId: string;
  newDate: Date;
  newStartTime: string;
  newEndTime: string;
  reason?: string;
}
