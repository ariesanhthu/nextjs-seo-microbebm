import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const TagSchema = GeneralSchema.extend({
  name: z.string().min(1, 'Tag name is required').max(100, 'Name too long'),
  slug: z.string().min(1).max(100),
}).strict();


export const CreateTagSchema = TagSchema.pick({
  name: true
});


export const UpdateTagSchema = TagSchema.pick({
  name: true
}).partial();

export const TagResponseSchema = TagSchema;