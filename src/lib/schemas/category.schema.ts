import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const CategorySchema = GeneralSchema.extend({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
  slug: z.string().min(1).max(100),
}).strict();


export const CreateCategorySchema = CategorySchema.pick({
  name: true
});


export const UpdateCategorySchema = CategorySchema.pick({
  name: true
}).partial();

export const CategoryResponseSchema = CategorySchema;