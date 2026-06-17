import { RiskLevel, CrisisSource, CrisisStatus } from "../enums";

export interface HighRiskDetectionDto {
  studentId: string;
  timeWindowHours?: number;
  riskThreshold?: RiskLevel;
}

export interface HighRiskDetectionResultDto {
  studentId: string;
  studentName: string;
  isMultipleHighRisk: boolean;
  highRiskCount: number;
  timeWindowHours: number;
  firstAssessmentDate?: Date;
  latestAssessmentDate?: Date;
  assessments: any[];
  existingCrisisCaseId?: string;
  shouldEscalate: boolean;
  escalationReason: string;
  suggestedActions: string[];
}

export interface CreateCrisisFromAssessmentDto {
  studentId: string;
  assessmentIds: string[];
  reporterId: string;
  source: CrisisSource;
  severity: RiskLevel;
  title: string;
  description: string;
  isEmergency: boolean;
  notifyCrisisLeader?: boolean;
  notifyMentor?: boolean;
}

export interface CrisisTimelineResponseDto {
  id: string;
  crisisCaseId: string;
  type: 'assessment' | 'appointment' | 'referral' | 'tracking' | 'takeover' | 'status_change' | 'note';
  title: string;
  description: string;
  timestamp: Date;
  actorId?: string;
  actorName?: string;
  relatedId?: string;
  relatedType?: string;
  details?: Record<string, unknown>;
}

export interface CrisisTimelineQueryDto {
  crisisCaseId: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CrisisCaseDetailDto {
  crisisCase: any;
  assessments: any[];
  appointments: any[];
  referrals: any[];
  trackingRecords: any[];
  followUps: any[];
  takeoverRecords: any[];
  timeline: CrisisTimelineResponseDto[];
  dailyTrackingSummary?: any;
}

export interface EscalateCrisisDto {
  crisisCaseId: string;
  newSeverity: RiskLevel;
  newStatus?: CrisisStatus;
  reason: string;
  operatorId: string;
  notifyCrisisLeader?: boolean;
  notifyMentor?: boolean;
  notifyFamily?: boolean;
}

export interface CloseTrackingDto {
  crisisCaseId: string;
  reason: string;
  closedBy: string;
  finalStatus: CrisisStatus;
}
