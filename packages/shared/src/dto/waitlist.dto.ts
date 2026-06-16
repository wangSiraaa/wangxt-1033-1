export interface CreateWaitlistEntryDto {
  studentId: string;
  counselorId: string;
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  type?: string;
}

export interface UpdateWaitlistEntryDto {
  status?: string;
  priority?: number;
  notes?: string;
  matchedAppointmentId?: string;
}

export interface WaitlistEntryResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  type?: string;
  status: string;
  priority: number;
  position: number;
  matchedAppointmentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WaitlistQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  studentId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface MatchWaitlistDto {
  appointmentId: string;
  waitlistEntryIds: string[];
}
