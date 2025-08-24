import { z } from 'zod';
import { 
  CreateTagSchema, 
  UpdateTagSchema, 
  TagResponseSchema
} from '@/lib/schemas/tag.schema';


// DTO for creating a new tag
export type CreateTagDto = z.infer<typeof CreateTagSchema>;

// DTO for updating an existing tag
export type UpdateTagDto = z.infer<typeof UpdateTagSchema>;

// DTO for tag response (includes all fields + metadata)
export type TagResponseDto = z.infer<typeof TagResponseSchema>;