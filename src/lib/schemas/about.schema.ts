import z from "zod"
import { EStyleSection } from "../enums/style-section.enum"
import { GeneralSchema } from "./general.schema"

export const AboutSchema = GeneralSchema.extend({
  section: z.array(z.object({
    title: z.string({ message: "Title is a string" }),
    subtitle: z.string({ message: "Subtitle is a string" }),
    subsection: z.array(z.object({
      name: z.string({ message: "Name is a string" }),
      description: z.string({ message: "Description is a string" }),
      ref: z.string({ message: "Ref is a string" }).nullable().default(null),
      icon: z.string({ message: "Icon is a string" }).nullable().default(null),
      image_url: z.string({ message: "Image URL is a string" }).nullable().default(null),
    })).default([]),
    style: z.enum(EStyleSection, { message: "Invalid style" })
  }))
}).strict();

export const CreateAboutSchema = AboutSchema.pick({
  section: true
});

export const UpdateAboutSchema = z.object({
  section: z.array(z.object({
    title: z.string({ message: "Title is a string" }).optional(),
    subtitle: z.string({ message: "Subtitle is a string" }).optional(),
    subsection: z.array(z.object({
      name: z.string({ message: "Name is a string" }),
      description: z.string({ message: "Description is a string" }),
      ref: z.string({ message: "Ref is a string" }).nullable().default(null),
      icon: z.string({ message: "Icon is a string" }).nullable().default(null),
      image_url: z.string({ message: "Image URL is a string" }).nullable().default(null),
    }).strict()).default([]),
    style: z.enum(EStyleSection, { message: "Invalid style" })
  }).strict())
}).strict();

export const AboutResponseSchema = AboutSchema;
