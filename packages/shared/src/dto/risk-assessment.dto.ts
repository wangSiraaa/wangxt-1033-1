import { RiskLevel } from "../enums";

export interface CreateRiskAssessmentDto {
  studentId: string;
  appointmentId?: string;
  selfHarmScore: number;
  suicideScore: number;
  depressionScore: number;
  anxietyScore: number;
  socialFunctionScore: number;
  overallScore?: number;
  riskLevel?: RiskLevel;
  assessorId: string;
  notes?: string;
}

export interface UpdateRiskAssessmentDto {
  selfHarmScore?: number;
  suicideScore?: number;
  depressionScore?: number;
  anxietyScore?: number;
  socialFunctionScore?: number;
  overallScore?: number;
  riskLevel?: RiskLevel;
  notes?: string;
}

export interface RiskAssessmentResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  appointmentId?: string;
  selfHarmScore: number;
  suicideScore: number;
  depressionScore: number;
  anxietyScore: number;
  socialFunctionScore: number;
  overallScore: number;
  riskLevel: RiskLevel;
  assessorId: string;
  assessorName: string;
  notes?: string;
  assessmentDate: Date;
  nextAssessmentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskAssessmentQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  counselorId?: string;
  riskLevel?: RiskLevel;
  startDate?: Date;
  endDate?: Date;
}
