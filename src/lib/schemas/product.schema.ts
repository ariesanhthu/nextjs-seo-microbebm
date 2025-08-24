import { z } from 'zod'
import { DocumentReferenceSchema, GeneralSchema } from './general.schema'

export const ProductSchema = GeneralSchema.extend({
  name: z.string().min(1, 'Product name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Product slug is required').max(100, 'Slug too long'),
  description: z.string().default(""),
  main_img: z.string().default(""),
  sub_img: z.array(z.string()).default([]),
  category_refs: z.array(DocumentReferenceSchema).default([]),
}).strict()

export const CreateProductSchema = ProductSchema.pick({
  name: true,
  description: true,
  main_img: true,
  sub_img: true
}).extend({
  category_ids: z.array(z.string()).default([])
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const ProductResponseSchema = ProductSchema
  .omit({ category_refs: true })
  .extend({
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string()
    })).default([])
  })
