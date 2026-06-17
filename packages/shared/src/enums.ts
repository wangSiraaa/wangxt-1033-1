export enum UserRole {
  STUDENT = 'student',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
  CRISIS_LEADER = 'crisis_leader',
  DUTY_COUNSELOR = 'duty_counselor',
  MENTOR = 'mentor',
}

export enum CounselorQualification {
  INTERN = 'intern',
  JUNIOR = 'junior',
  MIDDLE = 'middle',
  SENIOR = 'senior',
  SUPERVISOR = 'supervisor',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  WAITLIST = 'waitlist',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
  TRANSFERRED = 'transferred',
  TAKEN_OVER = 'taken_over',
}

export enum SatisfactionStatus {
  PENDING = 'pending',
  AVAILABLE = 'available',
  SUBMITTED = 'submitted',
  LOCKED = 'locked',
}

export enum CrisisStatus {
  IDENTIFIED = 'identified',
  FIRST_REVIEW = 'first_review',
  SECOND_REVIEW = 'second_review',
  APPROVED = 'approved',
  REFERRED = 'referred',
  TRACKING = 'tracking',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
  MANUAL_TAKEOVER = 'manual_takeover',
}

export enum ScheduleChangeType {
  COUNSELOR_ADJUST = 'counselor_adjust',
  STUDENT_RESCHEDULE = 'student_reschedule',
  ADMIN_CLOSE = 'admin_close',
  ROOM_CHANGE = 'room_change',
}

export enum NotificationType {
  APPOINTMENT_CONFIRMED = 'appointment_confirmed',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  WAITLIST_PROMOTED = 'waitlist_promoted',
  CRISIS_ALERT = 'crisis_alert',
  CRISIS_REVIEW_REQUIRED = 'crisis_review_required',
  SCHEDULE_CHANGED = 'schedule_changed',
  SATISFACTION_AVAILABLE = 'satisfaction_available',
  SYSTEM_NOTICE = 'system_notice',
  DUTY_REMINDER = 'duty_reminder',
  GROUP_COUNSELING_REMINDER = 'group_counseling_reminder',
  DAILY_TRACKING_REMINDER = 'daily_tracking_reminder',
  TAKEOVER_NOTICE = 'takeover_notice',
  FOLLOWUP_REMINDER = 'followup_reminder',
  MENTOR_NOTICE = 'mentor_notice',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  SUBMIT = 'submit',
  APPROVE = 'approve',
  REJECT = 'reject',
  CANCEL = 'cancel',
  COMPLETE = 'complete',
  RESCHEDULE = 'reschedule',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VIEW = 'view',
  EXPORT = 'export',
  TAKEOVER = 'takeover',
  TRANSFER = 'transfer',
}

export enum CounselorSpecialty {
  GENERAL = 'general',
  ANXIETY = 'anxiety',
  DEPRESSION = 'depression',
  RELATIONSHIP = 'relationship',
  ACADEMIC = 'academic',
  CAREER = 'career',
  FAMILY = 'family',
  TRAUMA = 'trauma',
  SLEEP = 'sleep',
  EATING = 'eating',
  ADDICTION = 'addiction',
  CRISIS = 'crisis',
  GROUP = 'group',
}

export enum DutyShiftType {
  DAY = 'day',
  NIGHT = 'night',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday',
}

export enum DutyStatus {
  SCHEDULED = 'scheduled',
  ON_DUTY = 'on_duty',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  SWAPPED = 'swapped',
}

export enum GroupCounselingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  REGISTERING = 'registering',
  FULL = 'full',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum GroupMemberStatus {
  REGISTERED = 'registered',
  CONFIRMED = 'confirmed',
  ATTENDED = 'attended',
  ABSENT = 'absent',
  DROPPED = 'dropped',
  WAITLIST = 'waitlist',
}

export enum FollowUpStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  OVERDUE = 'overdue',
}

export enum FollowUpType {
  PHONE = 'phone',
  ONLINE = 'online',
  OFFLINE = 'offline',
  MESSAGE = 'message',
}

export enum TakeoverReason {
  HIGH_RISK = 'high_risk',
  CRITICAL_RISK = 'critical_risk',
  STUDENT_REQUEST = 'student_request',
  COUNSELOR_REFERRAL = 'counselor_referral',
  ADMIN_ASSIGN = 'admin_assign',
  MULTIPLE_CRISIS = 'multiple_crisis',
  NIGHT_EMERGENCY = 'night_emergency',
}

export enum DailyTrackingStatus {
  PENDING = 'pending',
  TRACKED = 'tracked',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
}

export enum RoomType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  CONFIDENTIAL = 'confidential',
  ONLINE = 'online',
  MULTI_FUNCTION = 'multi_function',
}

export enum CrisisSource {
  QUESTIONNAIRE = 'questionnaire',
  COUNSELOR_REPORT = 'counselor_report',
  STUDENT_SELF_REPORT = 'student_self_report',
  PEER_REPORT = 'peer_report',
  MENTOR_REPORT = 'mentor_report',
  ADMIN_ASSIGN = 'admin_assign',
  NIGHT_DUTY = 'night_duty',
  MULTIPLE_HIGH_RISK = 'multiple_high_risk',
}

export enum ReferralType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  HOSPITAL = 'hospital',
  PSYCHIATRIC = 'psychiatric',
  COMMUNITY = 'community',
}

export enum TrackingRecordType {
  DAILY_CHECK = 'daily_check',
  PHONE_FOLLOWUP = 'phone_followup',
  VISIT = 'visit',
  MESSAGE = 'message',
  STATUS_UPDATE = 'status_update',
  ESCALATION = 'escalation',
}
