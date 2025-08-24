import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const TagSchema = GeneralSchema.extend({
  name: z.string({
    message: "Tag name must be a string"
  }).min(1, 'Tag name is required').max(100, 'Tag name is too long'),
  slug: z.string({
    message: "Slug must be a string"
  }).min(1, "Slug is required").max(100, "Slug is too long"),
}).strict();


export const CreateTagSchema = TagSchema.pick({
  name: true
});


export const UpdateTagSchema = TagSchema.pick({
  name: true
}).partial();

export const TagResponseSchema = TagSchema;