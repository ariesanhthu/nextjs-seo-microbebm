import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  CategoryResponseDto,
} from '@/lib/dto/category.dto';
import { CategorySchema, CreateCategorySchema, UpdateCategorySchema } from '@/lib/schemas/category.schema';
import { generateSlug } from '@/utils/generate-slug';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';
import { number } from 'zod';

export class CategoryService {
  private static readonly COLLECTION = 'categories';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(CategorySchema));
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION) 
    }


  static async create(categoryData: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      // Validate input data
      const validatedData = CreateCategorySchema.parse(categoryData);
      
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
        throw new Error('Failed to retrieve created category');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error(`Failed to create category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<CategoryResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      return doc.exists ? doc.data()! : null;
    } catch (error) {
      console.error('Error getting category by ID:', error);
      throw new Error(`Failed to get category: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      console.error('Error getting all categories:', error);
      throw new Error(`Failed to get categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, updateData: UpdateCategoryDto): Promise<CategoryResponseDto> {
    try {
      // Validate update data
      const validatedData = UpdateCategorySchema.parse(updateData);

      // Check if category exists
      const existing = await this.getDocRef(id).get();
      if (!existing) {
        throw new Error(`Category with id '${id}' not found`);
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
        throw new Error('Failed to retrieve updated category');
      }

      return updatedDoc.data()!;
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error(`Failed to update category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if category exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`Category with id '${id}' not found`);
      }

      // Delete the category
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error(`Failed to delete category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
