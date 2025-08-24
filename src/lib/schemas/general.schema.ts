import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export const GeneralSchema = z.object({
  id: z.string(),
  created_at: z.instanceof(Timestamp),
  updated_at: z.instanceof(Timestamp),
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