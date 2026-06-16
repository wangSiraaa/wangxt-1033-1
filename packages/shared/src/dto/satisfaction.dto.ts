import { SatisfactionStatus } from "../enums";

export interface CreateSatisfactionSurveyDto {
  appointmentId: string;
  studentId: string;
  counselorId: string;
  overallRating: number;
  counselorRating: number;
  environmentRating?: number;
  wouldRecommend: boolean;
  positiveFeedback?: string;
  improvementSuggestions?: string;
  comments?: string;
}

export interface UpdateSatisfactionSurveyDto {
  overallRating?: number;
  counselorRating?: number;
  environmentRating?: number;
  wouldRecommend?: boolean;
  positiveFeedback?: string;
  improvementSuggestions?: string;
  comments?: string;
  status?: SatisfactionStatus;
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
  environmentRating?: number;
  wouldRecommend: boolean;
  positiveFeedback?: string;
  improvementSuggestions?: string;
  comments?: string;
  status: SatisfactionStatus;
  surveyDate: Date;
  createdAt: Date;
  updatedAt: Date;
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

export interface SatisfactionSummaryDto {
  counselorId: string;
  counselorName: string;
  totalSurveys: number;
  averageOverallRating: number;
  averageCounselorRating: number;
  recommendationRate: number;
}
