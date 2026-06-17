import { ReferralType } from "../enums";

export interface CreateReferralDto {
  crisisCaseId?: string;
  studentId: string;
  referralType: ReferralType;
  referredFrom: string;
  referredTo: string;
  referralReason: string;
  referralDate?: Date;
  feedback?: string;
}

export interface UpdateReferralDto {
  referralType?: ReferralType;
  referredTo?: string;
  referralReason?: string;
  isAccepted?: boolean;
  acceptanceNotes?: string;
  acceptedAt?: Date;
  feedback?: string;
}

export interface ReferralResponseDto {
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

export interface ReferralQueryDto {
  page?: number;
  pageSize?: number;
  studentId?: string;
  crisisCaseId?: string;
  referralType?: ReferralType;
  isAccepted?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface AcceptReferralDto {
  acceptanceNotes?: string;
  acceptedBy?: string;
}
