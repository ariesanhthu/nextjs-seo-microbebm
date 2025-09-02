import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateCommonInformationDto, 
  UpdateCommonInformationDto, 
  CommonInformationResponseDto,
} from '@/lib/dto/common-information.dto';
import { CommonInformationSchema } from '@/lib/schemas/common-information.schema';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';

export class CommonInformationService {
  private static readonly COLLECTION = 'commoninformations';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(CommonInformationSchema));
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION) 
    }

  static async create(body: CreateCommonInformationDto): Promise<CommonInformationResponseDto> {
    try {
      const existing = await this.getReadCollectionRef().get();
      if (!existing.empty) {
        throw new Error('Common information is existed. Can not create new one.');
      }

      const now = Timestamp.now();
      const docData = {
        ...body,
        created_at: now,
        updated_at: now,
      };

      // Create document
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with ID
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists) {
        throw new Error('Failed to retrieve created common-information');
      }

      return createdDoc.data() || (() => { throw new Error('Failed to parse created CommonInformation data'); })();
    } catch (error) {
      console.error('Error creating common-information:', error);
      throw new Error(`Failed to create common-information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async get(): Promise<CommonInformationResponseDto | null> {
    try {
      const snapshot = await this.getReadCollectionRef().limit(1).orderBy("updated_at", ESort.DESC).get();
      const docs = snapshot.docs.map(doc => {
        try {
          return doc.data();
        } catch (error) {
          // If converter throws error, return null
          return null;
        }
      }).filter((data): data is NonNullable<typeof data> => data !== null);
      return docs[0] || null;
    } catch (error) {
      console.error('Error getting common-information:', error);
      throw new Error(`Failed to get common-information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<CommonInformationResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) return null;
      try {
        return doc.data() || null;
      } catch (error) {
        return null;
      }
    } catch (error) {
      console.error('Error getting common-information by ID:', error);
      throw new Error(`Failed to get common-information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<CommonInformationResponseDto>>> {
    try {
      const {
        cursor,
        limit = 10,
        sort = ESort.DESC
      } = query;

      let queryRef = this.getReadCollectionRef()
        .orderBy("created_at", sort)
        .limit(Number(limit) + 1); // +1 to check if there's a next page

      // If cursor exists, get the document and use it for startAfter
      if (cursor) {
        const cursorDoc = await this.getDocRef(cursor).get();
        if (cursorDoc.exists) {
          queryRef = queryRef.startAfter(cursorDoc);
        }
      }

      const snapshot = await queryRef.get();
      const allDocs = snapshot.docs.map(doc => {
        try {
          return doc.data();
        } catch (error) {
          // If converter throws error, return null
          return null;
        }
      }).filter((data): data is NonNullable<typeof data> => data !== null);
      
      // Check if there's a next page
      const hasNextPage = allDocs.length > limit;
      
      // Remove the extra document if it exists
      const data = hasNextPage ? allDocs.slice(0, limit) : allDocs;
      
      // Set nextCursor to the last document's ID
      const nextCursor = data.length > 0 ? data[data.length - 1].id : null;

      return {
        nextCursor,
        data,
        hasNextPage
      };
      
    } catch (error) {
      console.error('Error getting all common-informations:', error);
      throw new Error(`Failed to get common-informations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateCommonInformationDto): Promise<CommonInformationResponseDto> {
    try {
      // Check if common-information exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists || !existing.data()) {
        throw new Error(`CommonInformation with id '${id}' not found`);
      }

      // Update document
      await this.getWriteCollectionRef().doc(id).update({
        ...body,
        updated_at: Timestamp.now(),
      });

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated common-information');
      }

      return updatedDoc.data() || (() => { throw new Error('Failed to parse updated CommonInformation data'); })();
    } catch (error) {
      console.error('Error updating common-information:', error);
      throw new Error(`Failed to update common-information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if common-information exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`CommonInformation with id '${id}' not found`);
      }

      // Delete the common-information
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting common-information:', error);
      throw new Error(`Failed to delete common-information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
