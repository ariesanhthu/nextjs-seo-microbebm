import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

// Base schema - core category data without metadata
export const CategoryBaseSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
})

// Schema for creating categories (no id, no timestamps)
export const CreateCategorySchema = CategoryBaseSchema

// Schema for updating categories (all fields optional)
export const UpdateCategorySchema = CategoryBaseSchema.partial()

// Complete schema for documents in Firestore (includes id + timestamps)
export const CategorySchema = CategoryBaseSchema.extend({
  id: z.string(),
  created_at: z.instanceof(Timestamp),
  updated_at: z.instanceof(Timestamp),
})