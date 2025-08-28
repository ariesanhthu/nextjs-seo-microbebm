import { z } from 'zod';
import { 
  CreateImageMetadataSchema, 
  UpdateImageMetadataSchema, 
  ImageMetadataResponseSchema
} from '@/lib/schemas/image-metadata.schema';


// DTO for creating a new image-metadata
export type CreateImageMetadataDto = z.infer<typeof CreateImageMetadataSchema>;

// DTO for updating an existing image-metadata
export type UpdateImageMetadataDto = z.infer<typeof UpdateImageMetadataSchema>;

// DTO for image-metadata response (includes all fields + metadata)
export type ImageMetadataResponseDto = z.infer<typeof ImageMetadataResponseSchema>;