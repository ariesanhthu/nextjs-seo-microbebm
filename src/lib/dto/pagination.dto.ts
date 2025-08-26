import { z } from "zod";
import { ESort } from "../enums/sort.enum";

export interface PaginationCursorDto {
  cursor? : string,
  limit?: number,
  sort?: ESort
}

export interface PaginationCursorResponseDto<T> {
  success: boolean;
  data: T[];
  nextCursor?: string | null;
  hasNextPage: boolean;
  count: number;
}