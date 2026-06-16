import { UserRole, CounselorSpecialty, CounselorQualification } from "../enums";

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
