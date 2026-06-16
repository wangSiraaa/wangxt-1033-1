export interface CreateRoomDto {
  name: string;
  roomNumber: string;
  type: string;
  capacity: number;
  description?: string;
  facilities?: string[];
  isActive?: boolean;
}

export interface UpdateRoomDto {
  name?: string;
  roomNumber?: string;
  type?: string;
  capacity?: number;
  description?: string;
  facilities?: string[];
  isActive?: boolean;
}

export interface RoomResponseDto {
  id: string;
  name: string;
  roomNumber: string;
  type: string;
  capacity: number;
  description?: string;
  facilities: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomQueryDto {
  page?: number;
  pageSize?: number;
  type?: string;
  isActive?: boolean;
  keyword?: string;
}
