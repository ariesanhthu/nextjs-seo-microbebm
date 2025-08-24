import { FirestoreDataConverter, DocumentData } from 'firebase-admin/firestore';
import { ZodError, ZodType, z } from 'zod';
import { formatZodError } from '@/lib/format-error-response';

export function zodAdminConverter<T extends ZodType>(
  schema: T
): FirestoreDataConverter<z.infer<T>> {
  return {
    toFirestore(document: z.infer<T>): DocumentData {
      try {
        const validatedData = schema.parse(document);
        return validatedData as DocumentData;
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = formatZodError(error);
          const errorMessage = formattedErrors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          throw new Error(`Validation failed when writing to Firestore: ${errorMessage}`);
        }
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
          ...data
        });
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = formatZodError(error);
          const errorMessage = formattedErrors
            .map(err => `${err.field}: ${err.message}`)
            .join(', ');
          console.error(`Validation failed when reading from Firestore (doc: ${snapshot.id}): ${errorMessage}`);
          throw new Error(`Validation failed when reading from Firestore (doc: ${snapshot.id}): ${errorMessage}`);
        }
        console.error(`Validation failed when reading from Firestore (doc: ${snapshot.id}): ${error}`);
        throw new Error(`Validation failed when reading from Firestore (doc: ${snapshot.id}): ${error}`);
      }
    },
  };
}