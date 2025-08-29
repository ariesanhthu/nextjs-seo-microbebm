import { z } from "zod";
import { AboutResponseSchema, CreateAboutSchema, UpdateAboutSchema } from "../schemas/about.schema";
import { PaginationCursorDto } from "./pagination.dto";


export type CreateAboutDto = z.infer<typeof CreateAboutSchema>;

export type UpdateAboutDto = z.infer<typeof UpdateAboutSchema>;

export type AboutResponseDto = z.infer<typeof AboutResponseSchema>;

export type SubsectionDto = z.infer<typeof AboutResponseSchema.shape.section.element.shape.subsection>;

export interface PaginationCursorContactDto extends PaginationCursorDto  {
  is_check?: boolean,
}