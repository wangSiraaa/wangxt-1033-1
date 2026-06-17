import { DutyShiftType, DutyStatus } from "../enums";

export interface CreateDutyScheduleDto {
  counselorId: string;
  date: Date;
  shiftType: DutyShiftType;
  startTime: string;
  endTime: string;
  roomId?: string;
  isEmergencyDuty?: boolean;
  phone?: string;
  notes?: string;
}

export interface UpdateDutyScheduleDto {
  startTime?: string;
  endTime?: string;
  roomId?: string;
  status?: DutyStatus;
  isEmergencyDuty?: boolean;
  phone?: string;
  notes?: string;
}

export interface DutyScheduleResponseDto {
  id: string;
  counselorId: string;
  counselorName: string;
  date: Date;
  shiftType: DutyShiftType;
  startTime: string;
  endTime: string;
  status: DutyStatus;
  roomId?: string;
  roomName?: string;
  isEmergencyDuty: boolean;
  phone?: string;
  notes?: string;
  swapRequested: boolean;
  swapRequestedBy?: string;
  swapRequestedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DutyScheduleQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  startDate?: Date;
  endDate?: Date;
  shiftType?: DutyShiftType;
  status?: DutyStatus;
  isEmergencyDuty?: boolean;
}

export interface SwapDutyDto {
  targetCounselorId: string;
  reason?: string;
}

export interface BatchCreateDutyScheduleDto {
  counselorId: string;
  schedules: Array<{
    date: Date;
    shiftType: DutyShiftType;
    startTime: string;
    endTime: string;
    roomId?: string;
    isEmergencyDuty?: boolean;
  }>;
}

export interface DutyScheduleByDateDto {
  date: Date;
  dayShift?: DutyScheduleResponseDto;
  nightShift?: DutyScheduleResponseDto;
  weekendShift?: DutyScheduleResponseDto;
}
