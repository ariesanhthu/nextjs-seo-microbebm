import { z } from 'zod'
import { GeneralSchema } from './general.schema'
import { ProductResponseSchema } from './product.schema'

export const HomepageSchema = GeneralSchema.extend({
  title: z.string({
    message: "Homepage navigation_bar title must be a string"
  }),

  subtitle: z.string({
    message: "Homepage subtitle must be a string"
  }),

  banner: z.array(z.string({
    message: "Homepage banner item must be a string"
  }), {
    message: "Homepage banner must be an array"
  }).default([]),

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

  slider: z.array(z.object({
    title: z.string({
      message: "Homepage slider item title must be a string"
    }),
    description: z.string({
      message: "Homepage slider item description must be a string"
    }),
    image_url: z.string({
      message: "Homepage slider item image_url must be a string"
    })
  }), {
    message: "Homepage slider must be an array"
  }).default([]),

  products: z.array(ProductResponseSchema, {
    message: "Homepage products must be an array"
  }).default([]),
}).strict()

export const CreateHomepageSchema = HomepageSchema.pick({
  title: true,
  subtitle: true,
  banner: true,
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

export const UpdateHomepageSchema = z.object({
  title: z.string({
    message: "Homepage title must be a string"
  }).optional(),

  subtitle: z.string({
    message: "Homepage subtitle must be a string"
  }).optional(),

  banner: z.array(z.string({
    message: "Homepage banner item must be a string"
  }), {
    message: "Homepage banner must be an array"
  }).optional(),

  navigation_bar: z.array(z.object({
    title: z.string({
      message: "Homepage navigation_bar title must be a string"
    }),
    url: z.string({
      message: "Homepage navigation_bar URL must be a string"
    })
  }), {
    message: "Homepage navigation_bar must be an array"
  }).optional(),
  
  footer: z.object({
    vi_name: z.string({
      message: "Homepage footer vi_name must be a string"
    }).optional(),

    en_name: z.string({
      message: "Homepage footer en_name must be a string"
    }).optional(),

    tax_code: z.string({
      message: "Homepage footer tax_code must be a string"
    }).optional(),

    short_name: z.string({
      message: "Homepage footer short_name must be a string"
    }).optional(),

    owner: z.string({
      message: "Homepage footer owner must be a string"
    }).optional(),

    address: z.string({
      message: "Homepage footer address must be a string"
    }).optional(),
    
    email: z.email({
      message: "Homepage footer email must be a string"
    }).optional(),

    phone: z.string({
      message: "Homepage footer phone must be a string"
    }).optional(),

    working_time: z.string({
      message: "Homepage footer working_time must be a string"
    }).optional(),

    fanpage: z.string({
      message: "Homepage footer working_time must be a string"
    }).optional(),

    address_link: z.string({
      message: "Homepage footer working_time must be a string"
    }).optional(),

  }, {
    message: "Homepage footer must be an object"
  }),
  
  slider: z.array(z.object({
    title: z.string({
      message: "Homepage slider item title must be a string"
    }),
    description: z.string({
      message: "Homepage slider item description must be a string"
    }),
    image_url: z.string({
      message: "Homepage slider item image_url must be a string"
    })
  }), {
    message: "Homepage slider must be an array"
  }).optional(),

  product_ids: z.array(z.string({
    message: "Homepage product_ids item must be a string"
  }), {
    message: "Homepage product_ids must be a array"
  }).optional()
})


export const HomepageResponseSchema = HomepageSchema
