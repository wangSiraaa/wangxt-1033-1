export enum UserRole {
  STUDENT = 'student',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
  CRISIS_LEADER = 'crisis_leader',
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
}
