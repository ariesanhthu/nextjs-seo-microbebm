import { z } from 'zod'
import { GeneralSchema } from './general.schema'
import { ProductResponseSchema } from './product.schema'

export const HomepageSchema = GeneralSchema.extend({
  navigation_bar: z.array(z.object({
    title: z.string(),
    url: z.string() 
  })),
  footer: z.object({}),
  slider: z.array(z.string()),
  products: z.array(ProductResponseSchema),
}).strict()

export const CreateHomepageSchema = HomepageSchema.pick({
  navigation_bar: true,
  footer: true,
  slider: true,
}).extend({
  product_ids: z.array(z.string()).default([])
})

export const UpdateHomepageSchema = CreateHomepageSchema.partial()

export const HomepageResponseSchema = HomepageSchema
