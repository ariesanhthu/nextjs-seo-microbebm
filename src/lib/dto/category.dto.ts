import { z } from 'zod';
import { 
  CreateCategorySchema, 
  UpdateCategorySchema, 
  CategoryResponseSchema
} from '@/lib/schemas/category.schema';


// DTO for creating a new category
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

// DTO for updating an existing category
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

// DTO for category response (includes all fields + metadata)
export type CategoryResponseDto = z.infer<typeof CategoryResponseSchema>;