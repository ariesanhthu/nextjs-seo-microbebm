import { z } from 'zod';
import { 
  CategoryBaseSchema, 
  CreateCategorySchema, 
  UpdateCategorySchema, 
  CategorySchema
} from '@/lib/schemas/category.schema';


// Base category data type
export type CategoryBaseDto = z.infer<typeof CategoryBaseSchema>;

// DTO for creating a new category
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

// DTO for updating an existing category
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

// DTO for category response (includes all fields + metadata)
export type CategoryResponseDto = z.infer<typeof CategorySchema>;

// ========================
// Export all schemas for validation
// ========================
export {
  CategoryBaseSchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  CategorySchema,
};