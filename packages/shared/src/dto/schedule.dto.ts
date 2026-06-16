export interface CreateScheduleDto {
  counselorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  roomId?: string;
  isRecurring?: boolean;
  recurringRule?: string;
}

export interface UpdateScheduleDto {
  startTime?: string;
  endTime?: string;
  roomId?: string;
  isAvailable?: boolean;
}

export interface ScheduleResponseDto {
  id: string;
  counselorId: string;
  counselorName: string;
  date: Date;
  startTime: string;
  endTime: string;
  roomId?: string;
  roomName?: string;
  isAvailable: boolean;
  isBooked: boolean;
  appointmentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScheduleQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  startDate?: Date;
  endDate?: Date;
  isAvailable?: boolean;
  roomId?: string;
}

export interface BatchCreateScheduleDto {
  counselorId: string;
  schedules: Array<{
    date: Date;
    startTime: string;
    endTime: string;
    roomId?: string;
  }>;
}
