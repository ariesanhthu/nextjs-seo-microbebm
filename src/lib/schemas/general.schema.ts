import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const GeneralSchema = z.object({
  id: z.string({
    message: "ID must be a string"
  }),
  created_at: z.instanceof(Timestamp, {
    message: "Created date must be a valid Timestamp"
  }),
  updated_at: z.instanceof(Timestamp, {
    message: "Updated date must be a valid Timestamp"
  }),
})

export const DocumentReferenceSchema = z.custom<DocumentReference>(
  (val: any) => {
    return val && 
      typeof val === 'object' && 
      'id' in val && 
      'path' in val && 
      'parent' in val &&
      typeof val.get === 'function'
  },
  { message: "Must be a Firestore DocumentReference" }
)