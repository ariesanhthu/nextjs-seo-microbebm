import { z } from 'zod'
import { DocumentReferenceSchema, GeneralSchema } from './general.schema'
import { EBlogStatus } from '../enums/blog-status.enum'

export const BlogSchema = GeneralSchema.extend({
  title: z.string({
    message: "Blog title must be a string"
  }).min(1, 'Blog name is required').max(100, 'Name too long'),

  slug: z.string({
    message: "Blog slug must be a string"
  }).min(1, 'Blog slug is required').max(100, 'Slug too long'),

  author: z.string({
    message: "Blog author must be a string"
  }).min(2, 'Author name is too short').max(100, 'Author name is too long'),

  content: z.string({
    message: "Blog content must be a string"
  }).default(""),

  tag_refs: z.array(DocumentReferenceSchema, {
    message: "Blog tags_refs must be an array"
  }).default([]),

  thumbnail_url: z.string({
    message: "Blog thumbnail_url must be a string"
  }).default(""),

  status: z.enum(EBlogStatus, {
    message: "Blog status must be one of the following: draft, published, archived"
  }).default(EBlogStatus.DRAFT),

  is_featured: z.boolean({ 
    message: "Blog is_featured must be a boolean" 
  }).default(false),

  excerpt: z.string({
    message: "Blog excerpt must be a string"
  }).default(""),

  view_count: z.number({
    message: "Blog view_count must be a number"
  }).default(0),

  search: z.string({
    message: "Blog search must be a string"
  })
}).strict()

export const CreateBlogSchema = BlogSchema.pick({
  title: true,
  content: true,
  author: true,
  thumbnail_url: true,
  status: true,
  is_featured: true,
  excerpt: true,
}).extend({
  tag_ids: z.array(z.string({
    message: "Blog tag_ids item must be a string"
  }), {
    message: "Blog tag_ids must be an array"
  }).default([])
})

export const UpdateBlogSchema = CreateBlogSchema.partial().extend({
   content: z.string({
    message: "Blog content must be a string"
  }).optional(),

  thumbnail_url: z.string({
    message: "Blog thumbnail_url must be a string"
  }).optional(),

  status: z.enum(EBlogStatus, {
    message: "Blog status must be one of the following: draft, published, archived"
  }).optional(),

  is_featured: z.boolean({ 
    message: "Blog is_featured must be a boolean" 
  }).optional(),

  excerpt: z.string({
    message: "Blog excerpt must be a string"
  }).optional(),

  view_count: z.number({
    message: "Blog view_count must be a number"
  }).optional(),

  tag_ids: z.array(z.string({
    message: "Blog tag_ids item must be a string"
  }), {
    message: "Blog tag_ids must be an array"
  }).optional()
})

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
    })).default([]),
  })
