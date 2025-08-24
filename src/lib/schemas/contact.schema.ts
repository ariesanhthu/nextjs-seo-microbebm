import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const ContactSchema = GeneralSchema.extend({
  name: z.string(),
  email: z.email().nullable().default(null),
  phone: z.string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .length(10, "Phone number must be exactly 10 digits")
    .nullable()
    .default(null),
  description: z.string().default(""),
  is_check: z.boolean()
}).strict();

export const CreateContactSchema = ContactSchema.pick({
  name: true,
  email: true,
  phone: true,
  description: true
});


export const UpdateContactSchema = z.object({
  name: z.string(),
  email: z.email().nullable(),
  phone: z.string()
    .regex(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .length(10, "Phone number must be exactly 10 digits")
    .nullable(),
  description: z.string().default(""),
  is_check: z.boolean()
}).partial();

export const ContactResponseSchema = ContactSchema;