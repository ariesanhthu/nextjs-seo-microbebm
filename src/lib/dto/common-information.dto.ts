import { z } from 'zod';
import { 
  CreateCommonInformationSchema, 
  UpdateCommonInformationSchema, 
  CommonInformationResponseSchema
} from '@/lib/schemas/common-information.schema';


// DTO for creating a new common-information
export type CreateCommonInformationDto = z.infer<typeof CreateCommonInformationSchema>;

// DTO for updating an existing common-information
export type UpdateCommonInformationDto = z.infer<typeof UpdateCommonInformationSchema>;

// DTO for common-information response (includes all fields + metadata)
export type CommonInformationResponseDto = z.infer<typeof CommonInformationResponseSchema>;