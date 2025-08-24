import { z } from 'zod'
import { DocumentReferenceSchema, GeneralSchema } from './general.schema'

export const BlogSchema = GeneralSchema.extend({
  title: z.string({
    message: "Blog title must be a string"
  }).min(1, 'Blog name is required').max(100, 'Name too long'),

  slug: z.string({
    message: "Blog slug must be a string"
  }).min(1, 'Blog slug is required').max(100, 'Slug too long'),

  content: z.string({
    message: "Blog content must be a string"
  }).default(""),

  tag_refs: z.array(DocumentReferenceSchema, {
    message: "Blog tags_refs must be an array"
  }).default([]),
}).strict()

export const CreateBlogSchema = BlogSchema.pick({
  title: true,
  content: true,
}).extend({
  tag_ids: z.array(z.string({
    message: "Blog tag_ids item must be a string"
  }), {
    message: "Blog tag_ids must be an array"
  }).default([])
})

export const UpdateBlogSchema = CreateBlogSchema.partial()

export const BlogResponseSchema = BlogSchema
  .omit({ tag_refs: true })
  .extend({
    tags: z.array(z.object({
      id: z.string({
        message: "Blog tag id must be a string"
      }),

      name: z.string({
        message: "Blog tag name must be a string"
      }),

      slug: z.string({
        message: "Blog tag slug must be a string"
      })
    })).default([])
  })
