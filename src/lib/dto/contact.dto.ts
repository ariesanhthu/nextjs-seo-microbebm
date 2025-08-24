import { z } from 'zod';
import { 
  CreateContactSchema, 
  UpdateContactSchema, 
  ContactResponseSchema
} from '@/lib/schemas/contact.schema';


// DTO for creating a new contact
export type CreateContactDto = z.infer<typeof CreateContactSchema>;

// DTO for updating an existing contact
export type UpdateContactDto = z.infer<typeof UpdateContactSchema>;

// DTO for contact response (includes all fields + metadata)
export type ContactResponseDto = z.infer<typeof ContactResponseSchema>;