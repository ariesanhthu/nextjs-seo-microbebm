import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ProductResponseDto,
} from '@/lib/dto/product.dto';
import { ProductSchema } from '@/lib/schemas/product.schema';
import { generateSlug } from '@/utils/generate-slug';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';

export class ProductService {
  private static readonly COLLECTION = 'products';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(ProductSchema));
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION)
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static async populateCategory(doc: any): Promise<any> {
    // Fetch detail data of category, 
    // Exclude null doc
    const categories = (await Promise.all(
      doc.category_refs.map(async (ref: DocumentReference) => {
        const categoryDoc = await ref.get();
        if (!categoryDoc.exists) return null;

        return {
          id: categoryDoc.id,
          name: categoryDoc.data()?.name,
          slug: categoryDoc.data()?.slug,
        }
      })
    )).filter((category: any) => category !== null);

    const {category_refs, ...body} = doc;
    return {
      ...body,
      categories
    }
  }

  private static async getListRef(listIds: string[]) {
    const uniqueIds = [... (new Set(listIds))];
    const listRef = await Promise.all(
      uniqueIds.map(async (id) => {
        const doc = await adminDb.collection('categories').doc(id).get();
        if (!doc.exists) {
          throw new Error(`Category with ID '${id}' now found`);
        }
        return adminDb.collection('categories').doc(id);
      })
    )
    return listRef;
  }

  static async create(body: CreateProductDto): Promise<ProductResponseDto> {
    try {
      // Convert category_ids to DocumentReferences
      const categoryRefs = await this.getListRef(body.category_ids);
      
      const now = Timestamp.now();
      const docData = {
        name: body.name,
        description: body.description,
        main_img: body.main_img,
        content: body.content,
        sub_img: body.sub_img,
        category_refs: categoryRefs,
        slug: generateSlug([body.name]),
        created_at: now,
        updated_at: now,
      };

      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document and populate references
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists) {
        throw new Error('Failed to retrieve created Product');
      }

      return await this.populateCategory(createdDoc.data()) as ProductResponseDto;
    } catch (error) {
      console.error('Error creating Product:', error);
      throw new Error(`Failed to create Product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<ProductResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) {
        return null;
      }
      
      return await this.populateCategory(doc.data()) as ProductResponseDto;
    } catch (error) {
      console.error('Error getting Product by ID:', error);
      throw new Error(`Failed to get Product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<ProductResponseDto>>> {
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
      const allDocs = await Promise.all(
        snapshot.docs.map(async (doc: any) => {
          const rawData = { id: doc.id, ...doc.data() };
          return await this.populateCategory(rawData) as ProductResponseDto;
        })
      );
      
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
      console.error('Error getting all products:', error);
      throw new Error(`Failed to get products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      // Check if Product exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists) {
        throw new Error(`Product with id '${id}' not found`);
      }

      const existingData = existing.data();
      const slug = body.name ? generateSlug([body.name]) : existingData?.slug;
      
      // Convert category_ids to DocumentReferences if provided
      let updateFields: any = {
        ...body,
        slug: slug,
        updated_at: Timestamp.now(),
      };
      
      if (body.category_ids) {
        updateFields.category_refs = await this.getListRef(body.category_ids)
        delete updateFields.category_ids;
      }
   
      // Update document
      await this.getWriteCollectionRef().doc(id).update(updateFields);

      // Get updated document and populate references
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated Product');
      }

      return await this.populateCategory(updatedDoc.data()) as ProductResponseDto;
    } catch (error) {
      console.error('Error updating Product:', error);
      throw new Error(`Failed to update Product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if Product exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`Product with id '${id}' not found`);
      }

      // Delete the Product
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting Product:', error);
      throw new Error(`Failed to delete Product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
