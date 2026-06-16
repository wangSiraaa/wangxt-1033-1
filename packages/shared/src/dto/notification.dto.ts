import { NotificationType } from "../enums";

export interface CreateNotificationDto {
  userId: string;
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
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  readAt?: Date;
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
