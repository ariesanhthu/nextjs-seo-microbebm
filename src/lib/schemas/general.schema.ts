import { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

// Accept both firebase-admin and client Firestore Timestamp-like values
const isFirestoreTimestamp = (val: any) => {
  if (!val) return false;
  // firebase-admin Timestamp instanceof check
  if (val instanceof Timestamp) return true;
  // client SDK Timestamp (modular) or plain object with timestamp shape
  const looksLike =
    typeof val === 'object' &&
    typeof val.seconds === 'number' &&
    typeof val.nanoseconds === 'number' &&
    typeof (val.toDate || (() => new Date())) === 'function';
  return looksLike;
}

export const GeneralSchema = z.object({
  id: z.string({
    message: "ID must be a string"
  }),
  created_at: z.custom<any>(isFirestoreTimestamp, {
    message: "Created date must be a valid Timestamp"
  }),
  updated_at: z.custom<any>(isFirestoreTimestamp, {
    message: "Updated date must be a valid Timestamp"
  }),
})

export const DocumentReferenceSchema = z.custom<DocumentReference>(
  (val: any) => {
    return val &&
      typeof val === 'object' &&
      typeof (val as any).id === 'string' &&
      typeof (val as any).path === 'string';
  },
  { message: "Must be a Firestore DocumentReference" }
)