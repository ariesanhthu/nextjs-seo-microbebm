import { z } from 'zod';
import { 
  CreateBlogSchema, 
  UpdateBlogSchema, 
  BlogResponseSchema,
} from '@/lib/schemas/blog.schema';
import { PaginationCursorDto } from './pagination.dto';
import { EBlogStatus } from '../enums/blog-status.enum';

// DTO for creating a new Blog
export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

// DTO for updating an existing Blog
export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;

// DTO for Blog response (includes all fields + metadata)
export type BlogResponseDto = z.infer<typeof BlogResponseSchema>;

export interface PaginationCursorBlogDto extends PaginationCursorDto  {
    search?: string, 
    tags?: string[], 
    status?: EBlogStatus 
}