const fs = require('fs');
const path = require('path');

const basePath = '/Users/mingyuan/workspace/sihuo/wangxtw3/1033/packages/shared/src';

const enumsContent = `export enum UserRole {
  STUDENT = "student",
  COUNSELOR = "counselor",
  ADMIN = "admin",
  CRISIS_LEADER = "crisis_leader",
}

export enum CounselorQualification {
  PRIMARY = "primary",
  INTERMEDIATE = "intermediate",
  SENIOR = "senior",
  SUPERVISOR = "supervisor",
}

export enum RiskLevel {
  NONE = "none",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AppointmentStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
  RESCHEDULED = "rescheduled",
}

export enum SatisfactionStatus {
  NOT_SUBMITTED = "not_submitted",
  SUBMITTED = "submitted",
  REVIEWED = "reviewed",
}

export enum CrisisStatus {
  REPORTED = "reported",
  ASSESSING = "assessing",
  ACTIVE = "active",
  MONITORING = "monitoring",
  RESOLVED = "resolved",
  CLOSED = "closed",
  ESCALATED = "escalated",
}

export enum ScheduleChangeType {
  ADD = "add",
  REMOVE = "remove",
  MODIFY = "modify",
  SWAP = "swap",
}

export enum NotificationType {
  APPOINTMENT_REMINDER = "appointment_reminder",
  APPOINTMENT_CONFIRMED = "appointment_confirmed",
  APPOINTMENT_CANCELLED = "appointment_cancelled",
  CRISIS_ALERT = "crisis_alert",
  SCHEDULE_CHANGE = "schedule_change",
  SYSTEM_NOTICE = "system_notice",
  SATISFACTION_SURVEY = "satisfaction_survey",
}

export enum AuditAction {
  LOGIN = "login",
  LOGOUT = "logout",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  APPROVE = "approve",
  REJECT = "reject",
  CANCEL = "cancel",
  EXPORT = "export",
  VIEW = "view",
}

export enum CounselorSpecialty {
  GENERAL = "general",
  ANXIETY = "anxiety",
  DEPRESSION = "depression",
  RELATIONSHIP = "relationship",
  CAREER = "career",
  FAMILY = "family",
  ADDICTION = "addiction",
  TRAUMA = "trauma",
  EATING_DISORDER = "eating_disorder",
  SLEEP = "sleep",
  STRESS = "stress",
  SELF_ESTEEM = "self_esteem",
}
`;

const interfacesContent = `import {
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
`;

const indexContent = `export * from "./enums";
export * from "./interfaces";
export * from "./dto";
export * from "./utils/risk-calculator";
`;

const authDtoContent = `export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
    email: string;
  };
}

export interface RegisterRequestDto {
  username: string;
  password: string;
  email: string;
  name: string;
  phone?: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequestDto {
  refreshToken: string;
}
`;

const userDtoContent = `import { UserRole, CounselorSpecialty, CounselorQualification } from "../enums";

export interface CreateUserDto {
  username: string;
  email: string;
  name: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UserResponseDto {
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

export interface CounselorProfileDto {
  id: string;
  userId: string;
  name: string;
  qualification: CounselorQualification;
  specialties: CounselorSpecialty[];
  introduction?: string;
  experienceYears: number;
  avatar?: string;
  isActive: boolean;
}

export interface UpdateCounselorProfileDto {
  qualification?: CounselorQualification;
  specialties?: CounselorSpecialty[];
  introduction?: string;
  experienceYears?: number;
}

export interface StudentProfileDto {
  id: string;
  userId: string;
  name: string;
  studentNumber: string;
  department?: string;
  grade?: string;
  gender?: string;
  birthday?: Date;
  phone?: string;
}

export interface UserQueryDto {
  page?: number;
  pageSize?: number;
  role?: UserRole;
  keyword?: string;
  isActive?: boolean;
}
`;

const appointmentDtoContent = `import { AppointmentStatus } from "../enums";

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
`;

const riskAssessmentDtoContent = `import { RiskLevel } from "../enums";

export interface CreateRiskAssessmentDto {
  studentId: string;
  selfHarmScore: number;
  suicideScore: number;
  depressionScore: number;
  anxietyScore: number;
  socialFunctionScore: number;
  notes?: string;
  recommendation?: string;
}

export interface UpdateRiskAssessmentDto {
  selfHarmScore?: number;
  suicideScore?: number;
  depressionScore?: number;
  anxietyScore?: number;
  socialFunctionScore?: number;
  notes?: string;
  recommendation?: string;
  riskLevel?: RiskLevel;
}

export interface RiskAssessmentResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
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

export interface RiskAssessmentQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  counselorId?: string;
  riskLevel?: RiskLevel;
  startDate?: Date;
  endDate?: Date;
}
`;

const crisisDtoContent = `import { CrisisStatus, RiskLevel } from "../enums";

export interface CreateCrisisCaseDto {
  studentId: string;
  title: string;
  description: string;
  severity: RiskLevel;
  isEmergency: boolean;
  policeInvolved?: boolean;
  hospitalInvolved?: boolean;
  familyNotified?: boolean;
}

export interface UpdateCrisisCaseDto {
  status?: CrisisStatus;
  severity?: RiskLevel;
  title?: string;
  description?: string;
  counselorId?: string;
  crisisLeaderId?: string;
  policeInvolved?: boolean;
  hospitalInvolved?: boolean;
  familyNotified?: boolean;
}

export interface CrisisCaseResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  reporterId: string;
  reporterName: string;
  counselorId?: string;
  counselorName?: string;
  crisisLeaderId?: string;
  crisisLeaderName?: string;
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

export interface CrisisCaseQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  status?: CrisisStatus;
  severity?: RiskLevel;
  counselorId?: string;
  crisisLeaderId?: string;
  isEmergency?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateTrackingNoteDto {
  crisisCaseId: string;
  content: string;
  noteType: string;
  isPrivate?: boolean;
  attachments?: string[];
}

export interface TrackingNoteResponseDto {
  id: string;
  crisisCaseId: string;
  authorId: string;
  authorName: string;
  content: string;
  noteType: string;
  createdAt: Date;
  isPrivate: boolean;
  attachments?: string[];
}

export interface EscalateCrisisDto {
  reason: string;
  targetRole: string;
}
`;

const scheduleDtoContent = `export interface CreateScheduleDto {
  counselorId: string;
  date: Date;
  startTime: string;
  endTime: string;
  roomId?: string;
  recurring?: boolean;
  recurringPattern?: string;
}

export interface UpdateScheduleDto {
  date?: Date;
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
  roomNumber?: string;
  building?: string;
  isAvailable: boolean;
  isOnline: boolean;
  recurring?: boolean;
  recurringPattern?: string;
}

export interface ScheduleQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  startDate?: Date;
  endDate?: Date;
  isAvailable?: boolean;
  isOnline?: boolean;
}

export interface BatchCreateScheduleDto {
  counselorId: string;
  schedules: {
    date: Date;
    startTime: string;
    endTime: string;
    roomId?: string;
  }[];
}
`;

const roomDtoContent = `export interface CreateRoomDto {
  name: string;
  roomNumber: string;
  building: string;
  capacity: number;
  isOnline: boolean;
  equipment?: string[];
  description?: string;
}

export interface UpdateRoomDto {
  name?: string;
  roomNumber?: string;
  building?: string;
  capacity?: number;
  isOnline?: boolean;
  equipment?: string[];
  description?: string;
  isActive?: boolean;
}

export interface RoomResponseDto {
  id: string;
  name: string;
  roomNumber: string;
  building: string;
  capacity: number;
  isOnline: boolean;
  equipment: string[];
  description?: string;
  isActive: boolean;
}

export interface RoomQueryDto {
  page?: number;
  pageSize?: number;
  building?: string;
  isOnline?: boolean;
  isActive?: boolean;
  minCapacity?: number;
  keyword?: string;
}
`;

const satisfactionDtoContent = `import { SatisfactionStatus } from "../enums";

export interface CreateSatisfactionSurveyDto {
  appointmentId: string;
  overallRating: number;
  counselorRating: number;
  environmentRating: number;
  usefulnessRating: number;
  feedback?: string;
  suggestions?: string;
  wouldRecommend: boolean;
}

export interface UpdateSatisfactionSurveyDto {
  status?: SatisfactionStatus;
  reviewedBy?: string;
}

export interface SatisfactionSurveyResponseDto {
  id: string;
  appointmentId: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
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

export interface SatisfactionSurveyQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  studentId?: string;
  status?: SatisfactionStatus;
  startDate?: Date;
  endDate?: Date;
  minRating?: number;
}

export interface SatisfactionStatsDto {
  totalSurveys: number;
  averageOverallRating: number;
  averageCounselorRating: number;
  averageEnvironmentRating: number;
  averageUsefulnessRating: number;
  recommendRate: number;
  submissionRate: number;
}
`;

const waitlistDtoContent = `export interface CreateWaitlistEntryDto {
  studentId: string;
  counselorId?: string;
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  priority?: number;
}

export interface UpdateWaitlistEntryDto {
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  priority?: number;
  isActive?: boolean;
}

export interface WaitlistEntryResponseDto {
  id: string;
  studentId: string;
  studentName: string;
  counselorId?: string;
  counselorName?: string;
  preferredDate?: Date;
  preferredTime?: string;
  reason?: string;
  priority: number;
  addedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  position: number;
  matchedAppointmentId?: string;
}

export interface WaitlistQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  isActive?: boolean;
  studentId?: string;
}
`;

const scheduleChangeDtoContent = `import { ScheduleChangeType } from "../enums";

export interface CreateScheduleChangeDto {
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
}

export interface ScheduleChangeResponseDto {
  id: string;
  counselorId: string;
  counselorName: string;
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
  operatorName: string;
  affectedAppointments: string[];
  affectedAppointmentsCount: number;
  createdAt: Date;
}

export interface ScheduleChangeQueryDto {
  page?: number;
  pageSize?: number;
  counselorId?: string;
  changeType?: ScheduleChangeType;
  startDate?: Date;
  endDate?: Date;
  operatorId?: string;
}
`;

const notificationDtoContent = `import { NotificationType } from "../enums";

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: string;
}

export interface BatchCreateNotificationDto {
  userIds: string[];
  type: NotificationType;
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: string;
}

export interface NotificationResponseDto {
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

export interface NotificationQueryDto {
  page?: number;
  pageSize?: number;
  userId?: string;
  type?: NotificationType;
  isRead?: boolean;
}

export interface MarkReadDto {
  notificationIds: string[];
}

export interface UnreadCountResponseDto {
  count: number;
}
`;

const auditDtoContent = `import { AuditAction } from "../enums";

export interface AuditLogResponseDto {
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

export interface AuditLogQueryDto {
  page?: number;
  pageSize?: number;
  userId?: string;
  action?: AuditAction;
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  keyword?: string;
}

export interface AuditStatsDto {
  totalLogs: number;
  actionStats: {
    action: AuditAction;
    count: number;
  }[];
  todayLogs: number;
  activeUsers: number;
}
`;

const paginationDtoContent = `export interface PaginationQueryDto {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortQueryDto {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
`;

const dtoIndexContent = `export * from "./auth.dto";
export * from "./user.dto";
export * from "./appointment.dto";
export * from "./risk-assessment.dto";
export * from "./crisis.dto";
export * from "./schedule.dto";
export * from "./room.dto";
export * from "./satisfaction.dto";
export * from "./waitlist.dto";
export * from "./schedule-change.dto";
export * from "./notification.dto";
export * from "./audit.dto";
export * from "./pagination.dto";
`;

const riskCalculatorContent = `import { RiskLevel } from "../enums";

export class RiskCalculator {
  private static readonly WEIGHTS = {
    selfHarm: 0.25,
    suicide: 0.35,
    depression: 0.15,
    anxiety: 0.1,
    socialFunction: 0.15,
  };

  private static readonly THRESHOLDS = {
    [RiskLevel.NONE]: 0,
    [RiskLevel.LOW]: 20,
    [RiskLevel.MEDIUM]: 40,
    [RiskLevel.HIGH]: 65,
    [RiskLevel.CRITICAL]: 85,
  };

  static calculateOverallScore(
    selfHarmScore: number,
    suicideScore: number,
    depressionScore: number,
    anxietyScore: number,
    socialFunctionScore: number
  ): number {
    const totalScore =
      selfHarmScore * this.WEIGHTS.selfHarm +
      suicideScore * this.WEIGHTS.suicide +
      depressionScore * this.WEIGHTS.depression +
      anxietyScore * this.WEIGHTS.anxiety +
      socialFunctionScore * this.WEIGHTS.socialFunction;

    return Math.min(100, Math.max(0, Math.round(totalScore)));
  }

  static determineRiskLevel(overallScore: number): RiskLevel {
    if (overallScore >= this.THRESHOLDS[RiskLevel.CRITICAL]) {
      return RiskLevel.CRITICAL;
    }
    if (overallScore >= this.THRESHOLDS[RiskLevel.HIGH]) {
      return RiskLevel.HIGH;
    }
    if (overallScore >= this.THRESHOLDS[RiskLevel.MEDIUM]) {
      return RiskLevel.MEDIUM;
    }
    if (overallScore >= this.THRESHOLDS[RiskLevel.LOW]) {
      return RiskLevel.LOW;
    }
    return RiskLevel.NONE;
  }

  static isUrgent(riskLevel: RiskLevel): boolean {
    return riskLevel === RiskLevel.HIGH || riskLevel === RiskLevel.CRITICAL;
  }

  static getReassessmentDays(riskLevel: RiskLevel): number {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return 3;
      case RiskLevel.HIGH:
        return 7;
      case RiskLevel.MEDIUM:
        return 14;
      case RiskLevel.LOW:
        return 30;
      default:
        return 90;
    }
  }

  static getRiskDescription(riskLevel: RiskLevel): string {
    switch (riskLevel) {
      case RiskLevel.NONE:
        return "无明显风险，学生心理状态良好";
      case RiskLevel.LOW:
        return "低风险，存在轻度心理困扰，建议关注";
      case RiskLevel.MEDIUM:
        return "中风险，存在明显心理问题，建议定期咨询";
      case RiskLevel.HIGH:
        return "高风险，存在较严重心理问题，需要重点关注和干预";
      case RiskLevel.CRITICAL:
        return "极高风险，存在严重自伤或自杀风险，需立即干预";
      default:
        return "";
    }
  }

  static validateScore(score: number): boolean {
    return score >= 0 && score <= 100;
  }

  static calculateScoreTrend(previousScore: number, currentScore: number): number {
    return currentScore - previousScore;
  }

  static getTrendDescription(trend: number): string {
    if (trend > 10) {
      return "风险显著上升";
    }
    if (trend > 0) {
      return "风险略有上升";
    }
    if (trend < -10) {
      return "风险显著下降";
    }
    if (trend < 0) {
      return "风险略有下降";
    }
    return "风险基本稳定";
  }
}
`;

const files = [
  { path: path.join(basePath, 'enums.ts'), content: enumsContent },
  { path: path.join(basePath, 'interfaces.ts'), content: interfacesContent },
  { path: path.join(basePath, 'index.ts'), content: indexContent },
  { path: path.join(basePath, 'dto', 'auth.dto.ts'), content: authDtoContent },
  { path: path.join(basePath, 'dto', 'user.dto.ts'), content: userDtoContent },
  { path: path.join(basePath, 'dto', 'appointment.dto.ts'), content: appointmentDtoContent },
  { path: path.join(basePath, 'dto', 'risk-assessment.dto.ts'), content: riskAssessmentDtoContent },
  { path: path.join(basePath, 'dto', 'crisis.dto.ts'), content: crisisDtoContent },
  { path: path.join(basePath, 'dto', 'schedule.dto.ts'), content: scheduleDtoContent },
  { path: path.join(basePath, 'dto', 'room.dto.ts'), content: roomDtoContent },
  { path: path.join(basePath, 'dto', 'satisfaction.dto.ts'), content: satisfactionDtoContent },
  { path: path.join(basePath, 'dto', 'waitlist.dto.ts'), content: waitlistDtoContent },
  { path: path.join(basePath, 'dto', 'schedule-change.dto.ts'), content: scheduleChangeDtoContent },
  { path: path.join(basePath, 'dto', 'notification.dto.ts'), content: notificationDtoContent },
  { path: path.join(basePath, 'dto', 'audit.dto.ts'), content: auditDtoContent },
  { path: path.join(basePath, 'dto', 'pagination.dto.ts'), content: paginationDtoContent },
  { path: path.join(basePath, 'dto', 'index.ts'), content: dtoIndexContent },
  { path: path.join(basePath, 'utils', 'risk-calculator.ts'), content: riskCalculatorContent },
];

files.forEach(file => {
  fs.mkdirSync(path.dirname(file.path), { recursive: true });
  fs.writeFileSync(file.path, file.content);
  console.log(`Created: ${file.path}`);
});

console.log('All files created successfully!');
