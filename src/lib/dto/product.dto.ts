import { z } from 'zod';
import { 
  CreateProductSchema, 
  UpdateProductSchema, 
  ProductResponseSchema,
} from '@/lib/schemas/product.schema';
import { PaginationCursorDto } from './pagination.dto';

// DTO for creating a new Product
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

// DTO for updating an existing Product
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

// DTO for Product response (includes all fields + metadata)
export type ProductResponseDto = z.infer<typeof ProductResponseSchema>;

export interface PaginationCursorProductDto extends PaginationCursorDto  {
  search?: string, 
  categories?: string[]
}