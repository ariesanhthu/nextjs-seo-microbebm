import { z } from 'zod'
import { DocumentReferenceSchema, GeneralSchema } from './general.schema'

export const BlogSchema = GeneralSchema.extend({
  title: z.string().min(1, 'Blog name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Blog slug is required').max(100, 'Slug too long'),
  content: z.string().default(""),
  tag_refs: z.array(DocumentReferenceSchema).default([]),
}).strict()

export const CreateBlogSchema = BlogSchema.pick({
  title: true,
  content: true,
}).extend({
  tag_ids: z.array(z.string()).default([])
})

export const UpdateBlogSchema = CreateBlogSchema.partial()

export const BlogResponseSchema = BlogSchema
  .omit({ tag_refs: true })
  .extend({
    tags: z.array(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string()
    })).default([])
  })
