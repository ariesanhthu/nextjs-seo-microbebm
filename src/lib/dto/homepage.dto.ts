import { z } from 'zod';
import { 
  CreateHomepageSchema, 
  UpdateHomepageSchema, 
  HomepageResponseSchema,
  HomepageSchema
} from '@/lib/schemas/homepage.schema';

// DTO for creating a new Homepage
export type CreateHomepageDto = z.infer<typeof CreateHomepageSchema>;

// DTO for updating an existing Homepage
export type UpdateHomepageDto = z.infer<typeof UpdateHomepageSchema>;

// DTO for Homepage response (includes all fields + metadata)
export type HomepageResponseDto = z.infer<typeof HomepageResponseSchema>;

export type HomepageFooter = z.infer<typeof HomepageSchema.shape.footer>;
export type HomepageSlider = z.infer<typeof HomepageSchema.shape.slider>;
export type HomepageNavigationBar = z.infer<typeof HomepageSchema.shape.navigation_bar>;