import { z } from 'zod'
import { GeneralSchema } from './general.schema'


export const ImageMetadataSchema = GeneralSchema.extend({
  public_id: z.string({
    message: "ImageMetadata name must be a string"
  }),
  
  url: z.url({
    message: "ImageMetadata url invalid"
  }),

  width: z.number({
    message: "ImageMetadata width must be a number"
  }),

  height: z.number({
    message: "ImageMetadata width must be a number"
  })
}).strict();


export const CreateImageMetadataSchema = ImageMetadataSchema.pick({
  public_id: true,
  url: true,
  width: true,
  height: true 
});


export const UpdateImageMetadataSchema = CreateImageMetadataSchema.partial();

export const ImageMetadataResponseSchema = ImageMetadataSchema;