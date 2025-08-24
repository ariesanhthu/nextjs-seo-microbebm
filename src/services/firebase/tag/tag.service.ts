import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateTagDto, 
  UpdateTagDto, 
  TagResponseDto,
} from '@/lib/dto/tag.dto';
import { TagSchema } from '@/lib/schemas/tag.schema';
import { generateSlug } from '@/utils/generate-slug';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';

export class TagService {
  private static readonly COLLECTION = 'tags';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(TagSchema));
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION) 
    }


  static async create(body: CreateTagDto): Promise<TagResponseDto> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...body,
        slug: generateSlug([body.name]),
        created_at: now,
        updated_at: now,
      };

      // Create document
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with ID
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists) {
        throw new Error('Failed to retrieve created tag');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw new Error(`Failed to create tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<TagResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      return doc.exists ? doc.data()! : null;
    } catch (error) {
      console.error('Error getting tag by ID:', error);
      throw new Error(`Failed to get tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorDto): Promise<PaginationCursorResponseDto> {
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
      const allDocs = snapshot.docs.map(doc => doc.data()!);
      
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
      console.error('Error getting all tags:', error);
      throw new Error(`Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateTagDto): Promise<TagResponseDto> {
    try {
      // Check if tag exists
      const existing = await this.getDocRef(id).get();
      if (!existing) {
        throw new Error(`Tag with id '${id}' not found`);
      }

      const slug = body.name ? generateSlug([body.name]) : existing.data()?.slug;
   
      // Update document
      await this.getWriteCollectionRef().doc(id).update({
        ...body,
        slug: slug,
        updated_at: Timestamp.now(),
      });

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated tag');
      }

      return updatedDoc.data()!;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw new Error(`Failed to update tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if tag exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`Tag with id '${id}' not found`);
      }

      // Delete the tag
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw new Error(`Failed to delete tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
