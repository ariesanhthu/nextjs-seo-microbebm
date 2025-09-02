import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateAboutDto, 
  UpdateAboutDto, 
  AboutResponseDto,
} from '@/lib/dto/about.dto';
import { AboutSchema } from '@/lib/schemas/about.schema';
import { ProductService } from '@/services/firebase/product/product.service';
import { ESort } from '@/lib/enums/sort.enum';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/hooks/use-paginated-fetch';

export class AboutService {
  private static readonly COLLECTION = 'abouts';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(AboutSchema));
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION);
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static async populateProducts(product_ids: string[]) {
    return await Promise.all(
      product_ids.map(async (productId) => {
        const product = await ProductService.getById(productId);
        if (!product) {
          throw new Error(`Product with id '${productId}' not found`);
        }
        return product;
      })
    );
  }

  static async create(body: CreateAboutDto): Promise<AboutResponseDto> {
    try {
      const existing = await this.getReadCollectionRef().get();
      if (!existing.empty) {
        throw new Error('About is existed. Can not create new one.');
      }
      
      const now = Timestamp.now();
      const docData = {
        ...body,
        created_at: now,
        updated_at: now,
      };

      // Create document without converter to avoid validation issues
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with converter for validation
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists || !createdDoc.data()) {
        throw new Error('Failed to retrieve created About');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating About:', error);
      throw new Error(`Failed to create About: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async get(): Promise<AboutResponseDto | null> {
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
      console.error('Error getting all abouts:', error);
      throw new Error(`Failed to get abouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<AboutResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) {
        return null;
      }
      
      try {
        return doc.data() || null;
      } catch (error) {
        return null;
      }
    } catch (error) {
      console.error('Error getting About by ID:', error);
      throw new Error(`Failed to get About: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // fix the getAll with pagination like other service
  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<AboutResponseDto>>> {
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
      console.error('Error getting all abouts:', error);
      throw new Error(`Failed to get abouts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateAboutDto): Promise<AboutResponseDto> {
    try {
      // Check if About exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists) {
        throw new Error(`About with id '${id}' not found`);
      }

      // Prepare update fields
      let updateFields: any = {
        ...body,
        updated_at: Timestamp.now(),
      };

      // Update document
      await this.getWriteCollectionRef().doc(id).update(updateFields);

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated About');
      }

      return updatedDoc.data() || (() => { throw new Error('Failed to parse updated About data'); })();
    } catch (error) {
      console.error('Error updating About:', error);
      throw new Error(`Failed to update About: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if About exists
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) {
        throw new Error(`About with id '${id}' not found`);
      }

      // Delete the About
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting About:', error);
      throw new Error(`Failed to delete About: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
