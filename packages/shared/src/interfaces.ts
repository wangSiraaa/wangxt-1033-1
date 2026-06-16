import {
  UserRole,
  CounselorQualification,
  RiskLevel,
  AppointmentStatus,
  SatisfactionStatus,
  CrisisStatus,
  ScheduleChangeType,
  NotificationType,
  AuditAction,
  CounselorSpecialty,
} from "./enums";

export interface IUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom {
  id: string;
  name: string;
  roomNumber: string;
  building: string;
  capacity: number;
  isOnline: boolean;
  equipment?: string[];
  description?: string;
  isActive: boolean;
}

export interface ICounselorSchedule {
  id: string;
  counselorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  roomId?: string;
  isAvailable: boolean;
  recurring?: boolean;
  recurringPattern?: string;
}

export interface IRiskAssessment {
  id: string;
  studentId: string;
  counselorId: string;
  assessmentDate: Date;
  riskLevel: RiskLevel;
  overallScore: number;
  selfHarmScore: number;
  suicideScore: number;
  depressionScore: number;
  anxietyScore: number;
  socialFunctionScore: number;
  notes?: string;
  recommendation?: string;
  isReassessment: boolean;
  reassessmentDate?: Date;
}

export interface IAppointment {
  id: string;
  studentId: string;
  counselorId: string;
  scheduleId: string;
  roomId?: string;
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
  cancelledAt?: Date;
  cancelledBy?: string;
  cancelReason?: string;
}

export interface ICrisisCase {
  id: string;
  studentId: string;
  reporterId: string;
  counselorId?: string;
  crisisLeaderId?: string;
  status: CrisisStatus;
  severity: RiskLevel;
  title: string;
  description: string;
  reportedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  isEmergency: boolean;
  policeInvolved: boolean;
  hospitalInvolved: boolean;
  familyNotified: boolean;
}

export interface ITrackingNote {
  id: string;
  crisisCaseId: string;
  authorId: string;
  content: string;
  noteType: string;
  createdAt: Date;
  isPrivate: boolean;
  attachments?: string[];
}

export interface IWaitlistEntry {
  id: string;
  studentId: string;
  counselorId?: string;
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  priority: number;
  addedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  matchedAppointmentId?: string;
}

export interface IScheduleChange {
  id: string;
  counselorId: string;
  changeType: ScheduleChangeType;
  originalScheduleId?: string;
  newScheduleId?: string;
  changeDate: Date;
  oldStartTime?: string;
  oldEndTime?: string;
  newStartTime?: string;
  newEndTime?: string;
  reason?: string;
  operatorId: string;
  affectedAppointments: string[];
  createdAt: Date;
}

export interface INoShowRecord {
  id: string;
  studentId: string;
  appointmentId: string;
  date: Date;
  counselorId: string;
  reason?: string;
  isFirstOffense: boolean;
  penaltyApplied: boolean;
  penaltyType?: string;
  createdAt: Date;
}

export interface ISatisfactionSurvey {
  id: string;
  appointmentId: string;
  studentId: string;
  counselorId: string;
  overallRating: number;
  counselorRating: number;
  environmentRating: number;
  usefulnessRating: number;
  status: SatisfactionStatus;
  feedback?: string;
  suggestions?: string;
  wouldRecommend: boolean;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  relatedId?: string;
  relatedType?: string;
  createdAt: Date;
}

export interface IAuditLog {
  id: string;
  userId: string;
  username: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  createdAt: Date;
}

export interface IPaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface IAvailableSlot {
  date: Date;
  startTime: string;
  endTime: string;
  counselorId: string;
  counselorName: string;
  roomId?: string;
  roomName?: string;
  isOnline: boolean;
}
