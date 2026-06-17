import { DailyTrackingStatus, TrackingRecordType } from "../enums";

export interface CreateDailyTrackingDto {
  crisisCaseId: string;
  studentId: string;
  recordType: TrackingRecordType;
  content: string;
  moodLevel?: number;
  sleepStatus?: string;
  appetiteStatus?: string;
  isStable: boolean;
  needsFollowUp?: boolean;
  nextAction?: string;
  attachments?: string[];
}

export interface UpdateDailyTrackingDto {
  content?: string;
  status?: DailyTrackingStatus;
  moodLevel?: number;
  sleepStatus?: string;
  appetiteStatus?: string;
  isStable?: boolean;
  needsFollowUp?: boolean;
  nextAction?: string;
  attachments?: string[];
}

export interface DailyTrackingResponseDto {
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

export interface DailyTrackingQueryDto {
  page?: number;
  pageSize?: number;
  crisisCaseId?: string;
  studentId?: string;
  trackerId?: string;
  status?: DailyTrackingStatus;
  recordType?: TrackingRecordType;
  startDate?: Date;
  endDate?: Date;
}

export interface DailyTrackingSummaryDto {
  crisisCaseId: string;
  studentId: string;
  studentName: string;
  totalTrackingDays: number;
  lastTrackingDate?: Date;
  nextTrackingDate?: Date;
  consecutiveStableDays: number;
  needsAttention: boolean;
  pendingTrackings: number;
  latestTracking?: DailyTrackingResponseDto;
}

export interface MarkTrackingCompleteDto {
  status: DailyTrackingStatus;
  notes?: string;
}

export interface BulkTrackingReminderDto {
  crisisCaseIds?: string[];
  reminderType: 'daily' | 'overdue' | 'weekly';
}
