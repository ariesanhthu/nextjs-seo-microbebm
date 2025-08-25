import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const ContactSchema = GeneralSchema.extend({
  name: z.string({
    message: "Contact name must be a string"
  }).min(1, "Contact name cannot be empty").max(100, "Name is too long"),
  
  email: z.email("Invalid email format").nullable().default(null),
  
  phone: z.string({
    message: "Contact phone must be a string"
  })
    .regex(/^\d{10}$/, 'Contact phone must be exactly 10 digits')
    .length(10, "Contact phone must be exactly 10 digits")
    .nullable()
    .default(null),
  
  description: z.string({
    message: "Contact description must be a string"
  }).max(1000, "Contact description is too long").default(""),
  
  is_check: z.boolean({
    message: "Contact id_check must be a boolean"
  }).default(false)
}).strict();

export const CreateContactSchema = ContactSchema.pick({
  name: true,
  email: true,
  phone: true,
  description: true
});


export const UpdateContactSchema = z.object({
  name: z.string({message: "Contact name must be a string"}),

  email: z.email("Invalid email format").nullable(),

  phone: z.string()
    .regex(/^\d{10}$/, 'Contact phone must be exactly 10 digits')
    .length(10, "Contact phone must be exactly 10 digits"),

  description: z.string({
    message: "Contact description must be a string"
  }).max(1000, "Contact description is too long").default(""),

  is_check: z.boolean({
    message: "Contact check must be a boolean"
  }).default(false)
}).partial();

export const ContactResponseSchema = ContactSchema;