content = '''export enum UserRole {
  STUDENT = 'student',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
  CRISIS_LEADER = 'crisis_leader',
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
  WAITLIST = 'waitlist',
  CRISIS_REFERRAL = 'crisis_referral',
}

export enum SatisfactionStatus {
  LOCKED = 'locked',
  UNLOCKED = 'unlocked',
  SUBMITTED = 'submitted',
  REVIEWED = 'reviewed',
}

export enum CrisisStatus {
  REPORTED = 'reported',
  PENDING_REVIEW = 'pending_review',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  DOUBLE_REVIEWED = 'double_reviewed',
  REFERRAL_SENT = 'referral_sent',
  FOLLOWING_UP = 'following_up',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum ScheduleChangeType {
  TIME_CHANGE = 'time_change',
  ROOM_CHANGE = 'room_change',
  SWAP = 'swap',
  CANCEL = 'cancel',
  ADD = 'add',
}

export enum NotificationType {
  APPOINTMENT_CREATED = 'appointment_created',
  APPOINTMENT_CANCELLED = 'appointment_cancelled',
  APPOINTMENT_RESCHEDULED = 'appointment_rescheduled',
  APPOINTMENT_REMINDER = 'appointment_reminder',
  APPOINTMENT_COMPLETED = 'appointment_completed',
  WAITLIST_PROMOTED = 'waitlist_promoted',
  CRISIS_ALERT = 'crisis_alert',
  CRISIS_ASSIGNED = 'crisis_assigned',
  CRISIS_REVIEW_REQUIRED = 'crisis_review_required',
  SCHEDULE_CHANGE = 'schedule_change',
  SCHEDULE_CHANGE_APPROVED = 'schedule_change_approved',
  SCHEDULE_CHANGE_REJECTED = 'schedule_change_rejected',
  SATISFACTION_UNLOCKED = 'satisfaction_unlocked',
  SYSTEM_NOTIFICATION = 'system_notification',
}

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  CANCEL = 'cancel',
  APPROVE = 'approve',
  REJECT = 'reject',
  SUBMIT = 'submit',
  COMPLETE = 'complete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  VIEW = 'view',
  EXPORT = 'export',
}

export enum CounselorQualification {
  INTERN = 'intern',
  JUNIOR = 'junior',
  SENIOR = 'senior',
  EXPERT = 'expert',
}

export enum RoomType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  CRISIS = 'crisis',
  ONLINE = 'online',
}

export enum AppointmentType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
  COUPLE = 'couple',
  FAMILY = 'family',
  CRISIS = 'crisis',
  FOLLOW_UP = 'follow_up',
  REASSESSMENT = 'reassessment',
}

export enum WaitlistStatus {
  WAITING = 'waiting',
  PROMOTED = 'promoted',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum ScheduleChangeStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXECUTED = 'executed',
}
'''

with open('/Users/mingyuan/workspace/sihuo/wangxtw3/1033/packages/shared/src/enums.ts', 'w') as f:
    f.write(content)

print('File written successfully')
print(f'Lines: {len(content.splitlines())}')
