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
  DutyShiftType,
  DutyStatus,
  GroupCounselingStatus,
  GroupMemberStatus,
  FollowUpStatus,
  FollowUpType,
  TakeoverReason,
  DailyTrackingStatus,
  RoomType,
  CrisisSource,
  ReferralType,
  TrackingRecordType,
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
  type: RoomType;
  isOnline: boolean;
  isConfidential: boolean;
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
  isNightDuty: boolean;
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
  isHighRisk: boolean;
  triggeredCrisis: boolean;
  crisisCaseId?: string;
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
  isNightDuty: boolean;
  isGroup: boolean;
  groupCounselingId?: string;
  takenOver: boolean;
  takenOverAt?: Date;
  takenOverBy?: string;
  takeoverReason?: TakeoverReason;
  studentCannotCancel: boolean;
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
  source: CrisisSource;
  title: string;
  description: string;
  reportedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  isEmergency: boolean;
  policeInvolved: boolean;
  hospitalInvolved: boolean;
  familyNotified: boolean;
  mentorNotified: boolean;
  isManualTakeover: boolean;
  takeoverCounselorId?: string;
  takeoverReason?: TakeoverReason;
  takeoverAt?: Date;
  lastTrackingDate?: Date;
  nextTrackingDate?: Date;
  trackingCount: number;
  isTrackingClosed: boolean;
  riskAssessmentIds: string[];
  appointmentIds: string[];
  referralIds: string[];
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
  isNightDuty: boolean;
}

export interface IDutySchedule {
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
  createdBy: string;
}

export interface IGroupCounseling {
  id: string;
  title: string;
  description: string;
  counselorId: string;
  counselorName: string;
  coCounselorIds?: string[];
  coCounselorNames?: string[];
  roomId: string;
  roomName: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  totalSessions: number;
  currentSession: number;
  maxMembers: number;
  minMembers: number;
  status: GroupCounselingStatus;
  theme?: string;
  targetPopulation?: string;
  isConfidential: boolean;
  registrationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface IGroupCounselingMember {
  id: string;
  groupCounselingId: string;
  studentId: string;
  studentName: string;
  status: GroupMemberStatus;
  joinedAt: Date;
  leftAt?: Date;
  leaveReason?: string;
  attendanceCount: number;
  sessionAttendance: Record<string, boolean>;
  notes?: string;
  createdAt: Date;
}

export interface IFollowUp {
  id: string;
  crisisCaseId: string;
  studentId: string;
  studentName: string;
  assigneeId: string;
  assigneeName: string;
  type: FollowUpType;
  status: FollowUpStatus;
  scheduledDate: Date;
  scheduledTime?: string;
  completedAt?: Date;
  result?: string;
  notes?: string;
  followUpNumber: number;
  isMandatory: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITakeoverRecord {
  id: string;
  crisisCaseId: string;
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
  releaseReason?: string;
  createdAt: Date;
}

export interface IDailyTrackingRecord {
  id: string;
  crisisCaseId: string;
  studentId: string;
  studentName: string;
  trackerId: string;
  trackerName: string;
  trackingDate: Date;
  status: DailyTrackingStatus;
  recordType: TrackingRecordType;
  content: string;
  moodLevel?: number;
  sleepStatus?: string;
  appetiteStatus?: string;
  isStable: boolean;
  needsFollowUp: boolean;
  nextAction?: string;
  attachments?: string[];
  createdAt: Date;
}

export interface IReferralRecord {
  id: string;
  crisisCaseId?: string;
  studentId: string;
  studentName: string;
  referralType: ReferralType;
  referredFrom: string;
  referredFromName?: string;
  referredTo: string;
  referredToName?: string;
  referralReason: string;
  referralDate: Date;
  acceptedAt?: Date;
  isAccepted: boolean;
  acceptanceNotes?: string;
  feedback?: string;
  createdAt: Date;
}

export interface ICrisisTimeline {
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

export interface IHighRiskDetectionResult {
  studentId: string;
  studentName: string;
  isMultipleHighRisk: boolean;
  highRiskCount: number;
  timeWindowHours: number;
  firstAssessmentDate?: Date;
  latestAssessmentDate?: Date;
  assessments: IRiskAssessment[];
  existingCrisisCaseId?: string;
  shouldEscalate: boolean;
  escalationReason: string;
}
