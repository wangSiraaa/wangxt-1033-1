export interface PaginationQueryDto {
  page?: number;
  pageSize?: number;
}

export interface PaginationResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortQueryDto {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
