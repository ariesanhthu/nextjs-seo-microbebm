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
  
  footer: z.object({
    vi_name: z.string({
      message: "Homepage footer vi_name must be a string"
    }).default(""),

    en_name: z.string({
      message: "Homepage footer en_name must be a string"
    }).default(""),

    tax_code: z.string({
      message: "Homepage footer tax_code must be a string"
    }).default(""),

    short_name: z.string({
      message: "Homepage footer short_name must be a string"
    }).default(""),

    owner: z.string({
      message: "Homepage footer owner must be a string"
    }).default(""),

    address: z.string({
      message: "Homepage footer address must be a string"
    }).default(""),
    
    email: z.email({
      message: "Homepage footer email must be a string"
    }).default(""),

    phone: z.string({
      message: "Homepage footer phone must be a string"
    }).default(""),

    working_time: z.string({
      message: "Homepage footer working_time must be a string"
    }).default(""),

    fanpage: z.string({
      message: "Homepage footer working_time must be a string"
    }).default(""),

    address_link: z.string({
      message: "Homepage footer working_time must be a string"
    }).default(""),

  }, {
    message: "Homepage footer must be an object"
  }),
  
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
