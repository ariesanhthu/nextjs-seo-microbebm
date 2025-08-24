import { z } from 'zod';
import { 
  CreateProductSchema, 
  UpdateProductSchema, 
  ProductResponseSchema,
} from '@/lib/schemas/product.schema';

// DTO for creating a new Product
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

// DTO for updating an existing Product
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

// DTO for Product response (includes all fields + metadata)
export type ProductResponseDto = z.infer<typeof ProductResponseSchema>;