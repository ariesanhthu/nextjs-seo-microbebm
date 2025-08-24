import { z } from 'zod'
import { GeneralSchema } from './general.schema'
import { ProductResponseSchema } from './product.schema'

export const HomepageSchema = GeneralSchema.extend({
  navigation_bar: z.array(z.object({
    title: z.string({
      message: "Homepage navigation_bar title must be a string"
    }),
    url: z.string({
      message: "Homepage navigation_bar URL must be a string"
    })
  }), {
    message: "Homepage navigation_bar must be an array"
  }).default([]),
  
  footer: z.object({}, {
    message: "Homepage footer must be an object"
  }).default({}),
  
  slider: z.array(z.string({
    message: "Homepage slider item must be a string"
  }), {
    message: "Homepage slider must be an array"
  }).default([]),
  
  products: z.array(ProductResponseSchema, {
    message: "Homepage products must be an array"
  }).default([]),
}).strict()

export const CreateHomepageSchema = HomepageSchema.pick({
  navigation_bar: true,
  footer: true,
  slider: true,
}).extend({
  product_ids: z.array(z.string({
    message: "Homepage product_ids item must be a string"
  }), {
    message: "Homepage product_ids must be a array"
  }).default([])
})

export const UpdateHomepageSchema = CreateHomepageSchema.partial()

export const HomepageResponseSchema = HomepageSchema
