import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateTagDto, 
  UpdateTagDto, 
  TagResponseDto,
} from '@/lib/dto/tag.dto';
import { TagSchema, CreateTagSchema, UpdateTagSchema } from '@/lib/schemas/tag.schema';
import { generateSlug } from '@/utils/generate-slug';

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


  static async create(tagData: CreateTagDto): Promise<TagResponseDto> {
    try {
      // Validate input data
      const validatedData = CreateTagSchema.parse(tagData);
      
      const now = Timestamp.now();
      const docData = {
        ...validatedData,
        slug: generateSlug([validatedData.name]),
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

  static async getAll(): Promise<TagResponseDto[]> {
    try {
      const snapshot = await this.getReadCollectionRef().get();
      return snapshot.docs.map(doc => doc.data()!);
    } catch (error) {
      console.error('Error getting all tags:', error);
      throw new Error(`Failed to get tags: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, updateData: UpdateTagDto): Promise<TagResponseDto> {
    try {
      // Validate update data
      const validatedData = UpdateTagSchema.parse(updateData);

      // Check if tag exists
      const existing = await this.getDocRef(id).get();
      if (!existing) {
        throw new Error(`Tag with id '${id}' not found`);
      }

      const slug = validatedData.name ? generateSlug([validatedData.name]) : existing.data()?.slug;
   
      // Update document
      await this.getWriteCollectionRef().doc(id).update({
        ...validatedData,
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
