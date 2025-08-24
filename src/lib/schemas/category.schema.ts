import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const CategorySchema = GeneralSchema.extend({
  name: z.string({
    message: "Category name must be a string"
  }).min(1, 'Category name is required').max(100, 'Category name is too long'),
  slug: z.string({
    message: "Slug must be a string"
  }).min(1, "Slug is required").max(100, "Slug is too long"),
}).strict();


export const CreateCategorySchema = CategorySchema.pick({
  name: true
});


export const UpdateCategorySchema = CategorySchema.pick({
  name: true
}).partial();

export const CategoryResponseSchema = CategorySchema;