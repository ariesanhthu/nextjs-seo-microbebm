import { z } from "zod";
import { ESort } from "../enums/sort.enum";

export interface PaginationCursorDto {
  cursor? : string,
  limit?: number,
  sort?: ESort
}

export interface PaginationCursorResponseDto {
  nextCursor: string | null,
  data: any[],
  hasNextPage: boolean
}