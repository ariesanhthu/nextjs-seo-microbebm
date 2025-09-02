import { adminDb } from '@/services/firebase/firebase-admin';
import { v2 as cloudinary } from 'cloudinary';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateImageMetadataDto, 
  UpdateImageMetadataDto, 
  ImageMetadataResponseDto,
} from '@/lib/dto/image-metadata.dto';
import { ImageMetadataSchema } from '@/lib/schemas/image-metadata.schema';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';
import { Cloudinary } from '@/services/cloudinary/cloudinary.service';

export class ImageMetadataService {
  private static readonly COLLECTION = 'imagemetadatas';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(ImageMetadataSchema));
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION) 
    }


  static async create(body: CreateImageMetadataDto): Promise<ImageMetadataResponseDto> {
    try {
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
        throw new Error('Failed to retrieve created image-metadata');
      }

      return createdDoc.data() || (() => { throw new Error('Failed to parse created ImageMetadata data'); })();
    } catch (error) {
      console.error('Error creating image-metadata:', error);
      throw new Error(`Failed to create image-metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<ImageMetadataResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) return null;
      try {
        return doc.data() || null;
      } catch (error) {
        return null;
      }
    } catch (error) {
      console.error('Error getting image-metadata by ID:', error);
      throw new Error(`Failed to get image-metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<ImageMetadataResponseDto>>> {
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
      console.error('Error getting all categories:', error);
      throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateImageMetadataDto): Promise<ImageMetadataResponseDto> {
    try {
      // Check if image-metadata exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists || !existing.data()) {
        throw new Error(`ImageMetadata with id '${id}' not found`);
      }

      // Update document
      await this.getWriteCollectionRef().doc(id).update({
        ...body,
        updated_at: Timestamp.now(),
      });

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated image-metadata');
      }

      return updatedDoc.data() || (() => { throw new Error('Failed to parse updated ImageMetadata data'); })();
    } catch (error) {
      console.error('Error updating image-metadata:', error);
      throw new Error(`Failed to update image-metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if image-metadata exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`ImageMetadata with id '${id}' not found`);
      }
      const docData = doc.data();
      if (!docData) {
        throw new Error('Failed to parse document data for image deletion');
      }
      const removeImage = await Cloudinary.destroyImage(docData.public_id);
      if (removeImage.result !== "ok") {
        throw new Error(`Failed to delete image from Cloudinary: ${removeImage.error?.message || 'Unknown error'}`);
      }
      // Delete the image-metadata
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting image-metadata:', error);
      throw new Error(`Failed to delete image-metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
