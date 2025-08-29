import { z } from "zod";
import { AboutResponseSchema, CreateAboutSchema, UpdateAboutSchema } from "../schemas/about.schema";


export type CreateAboutDto = z.infer<typeof CreateAboutSchema>;

export type UpdateAboutDto = z.infer<typeof UpdateAboutSchema>;

export type AboutResponseDto = z.infer<typeof AboutResponseSchema>;

export type SubsectionDto = z.infer<typeof AboutResponseSchema.shape.section.element.shape.subsection>;