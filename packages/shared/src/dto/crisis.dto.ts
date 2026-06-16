import { CrisisStatus, RiskLevel } from "../enums";

export interface CreateCrisisCaseDto {
  studentId: string;
  reporterId: string;
  riskLevel: RiskLevel;
  description: string;
  source: string;
  appointmentId?: string;
}

export interface UpdateCrisisCaseDto {
  status?: CrisisStatus;
  riskLevel?: RiskLevel;
  description?: string;
  assignedCounselorId?: string;
  notes?: string;
}

export interface CrisisCaseResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  reporterId: string;
  reporterName: string;
  riskLevel: RiskLevel;
  status: CrisisStatus;
  description: string;
  source: string;
  appointmentId?: string;
  assignedCounselorId?: string;
  assignedCounselorName?: string;
  leaderId?: string;
  leaderName?: string;
  reportTime: Date;
  assessmentTime?: Date;
  resolveTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CrisisCaseQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  status?: CrisisStatus;
  riskLevel?: RiskLevel;
  assignedCounselorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AddTrackingNoteDto {
  content: string;
  isPrivate?: boolean;
}

export interface TrackingNoteResponseDto {
  id: string;
  crisisCaseId: string;
  authorId: string;
  authorName: string;
  content: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}
