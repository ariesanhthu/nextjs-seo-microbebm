import { z } from 'zod'
import { GeneralSchema } from './general.schema'

export const CommonInformationSchema = GeneralSchema.extend({
  facebook: z.string({message: "Common information facebook must be a string"}),

  zalo: z.string({message: "Common information zalo must be a string"}),

  gmail: z.email({message: "Common information gmail must be a string"}),

  phone: z.string({
    message: "Common information phone must be a string"
  })
    .regex(/^\d{10}$/, 'Common information phone must be exactly 10 digits')
    .length(10, "Common information phone must be exactly 10 digits")
    .nullable()
    .default(null),
}).strict();

export const CreateCommonInformationSchema = CommonInformationSchema.pick({
  facebook: true,
  zalo: true,
  gmail: true,
  phone: true
});

export const UpdateCommonInformationSchema = z.object({
  facebook: z.string({message: "Common information facebook must be a string"}),

  zalo: z.string({message: "Common information zalo must be a string"}),

  gmail: z.email({message: "Common information gmail must be a string"}),

  phone: z.string({
    message: "Common information phone must be a string"
  })
    .regex(/^\d{10}$/, 'Common information phone must be exactly 10 digits')
    .length(10, "Common information phone must be exactly 10 digits")
}).partial();

export const CommonInformationResponseSchema = CommonInformationSchema;