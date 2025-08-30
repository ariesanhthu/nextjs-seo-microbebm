import { z } from 'zod'
import { DocumentReferenceSchema, GeneralSchema } from './general.schema'

export const ProductSchema = GeneralSchema.extend({
  name: z.string({
    message: "Product name must be a string"
  }).min(1, 'Product name is required').max(100, 'Product name is too long'),
  
  slug: z.string({
    message: "Product slug must be a string"
  }).min(1, 'Product slug is required').max(100, 'Product slug is too long'),
  
  description: z.string({
    message: "Product description must be a string"
  }).default(""),
  
  main_img: z.string({
    message: "Product main_img must be a string"
  }).default(""),
  
  sub_img: z.array(z.string({
    message: "Product sub_img item must be a string"
  }), {
    message: "Product sub_img must be an array"
  }).default([]),
  
  content: z.string({
    message: "Product description must be a string"
  }).default(""),
  
  category_refs: z.array(DocumentReferenceSchema, {
    message: "Product category_refs must be an array"
  }).default([]),
}).strict()

export const CreateProductSchema = z.object({
  name: z.string({
    message: "Product name must be a string"
  }).min(1, 'Product name is required').max(100, 'Product name is too long'),
  
  description: z.string({
    message: "Product description must be a string"
  }).default(""),
  
  main_img: z.string({
    message: "Product main_img must be a string"
  }).default(""),
  
  content: z.string({
    message: "Product content must be a string"
  }).default(""),
  
  sub_img: z.array(z.string({
    message: "Product sub_img item must be a string"
  }), {
    message: "Product sub_img must be an array"
  }).default([]),
  
  category_ids: z.array(z.string({
    message: "Product category_ids item must be a string"
  }), {
    message: "Product category_ids be an array"
  }).default([])
})

export const UpdateProductSchema = CreateProductSchema.partial().extend({
  slug: z.string({
    message: "Product slug must be a string"
  }).min(1, 'Product slug is required').max(100, 'Product slug is too long').optional(),
})

export const ProductResponseSchema = ProductSchema
  .omit({ category_refs: true })
  .extend({
    categories: z.array(z.object({
      id: z.string({
        message: "Product category ID must be a string"
      }),

      name: z.string({
        message: "Product category name must be a string"
      }),
      
      slug: z.string({
        message: "Product category slug must be a string"
      })
    }), {
      message: "Product categories must be an array"
    }).default([])
  })
