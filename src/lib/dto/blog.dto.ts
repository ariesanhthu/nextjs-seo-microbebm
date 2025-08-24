import { z } from 'zod';
import { 
  CreateBlogSchema, 
  UpdateBlogSchema, 
  BlogResponseSchema,
} from '@/lib/schemas/blog.schema';

// DTO for creating a new Blog
export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;

// DTO for updating an existing Blog
export type UpdateBlogDto = z.infer<typeof UpdateBlogSchema>;

// DTO for Blog response (includes all fields + metadata)
export type BlogResponseDto = z.infer<typeof BlogResponseSchema>;