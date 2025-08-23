import { FirestoreDataConverter, DocumentData } from 'firebase-admin/firestore';
import { ZodType, z } from 'zod';

export function zodAdminConverter<T extends ZodType>(
  schema: T
): FirestoreDataConverter<z.infer<T>> {
  return {
    toFirestore(document: z.infer<T>): DocumentData {
      try {
        const validatedData = schema.parse(document);
        return validatedData as DocumentData;
      } catch (error) {
        throw new Error(`Validation failed when writing to Firestore: ${error}`);
      }
    },
    fromFirestore(snapshot): z.infer<T> {
      const data = snapshot.data();
      if (!data) {
        throw new Error(`Document ${snapshot.id} has no data`);
      }
      
      try {
        return schema.parse({
          id: snapshot.id,
          ... data
        });
      } catch (error) {
        throw new Error(`Validation failed when reading from Firestore (doc: ${snapshot.id}): ${error}`);
      }
    },
  };
}