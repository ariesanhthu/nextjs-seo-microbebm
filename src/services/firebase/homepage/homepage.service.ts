import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateHomepageDto, 
  UpdateHomepageDto, 
  HomepageResponseDto,
} from '@/lib/dto/homepage.dto';
import { HomepageSchema } from '@/lib/schemas/homepage.schema';
import { ProductService } from '@/services/firebase/product/product.service';
import { ESort } from '@/lib/enums/sort.enum';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/hooks/use-paginated-fetch';
import { BlogService } from '../blog/blog.service';

export class HomepageService {
  private static readonly COLLECTION = 'homepage';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(HomepageSchema));
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION);
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static async populateProducts(product_ids: string[]) {
    // Batch fetch products instead of individual calls
    if (product_ids.length === 0) return [];
    
    try {
      const products = await ProductService.getByIds(product_ids);
      return products;
    } catch (error) {
      console.error('Error batch fetching products:', error);
      // Fallback to individual calls if batch fails
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
  }

  private static async populateBlogs(blog_ids: string[]) {
    // Batch fetch blogs instead of individual calls
    if (blog_ids.length === 0) return [];
    
    try {
      const blogs = await BlogService.getByIds(blog_ids);
      return blogs;
    } catch (error) {
      console.error('Error batch fetching blogs:', error);
      // Fallback to individual calls if batch fails
      return await Promise.all(
        blog_ids.map(async (blogId) => {
          const blog = await BlogService.getById(blogId);
          if (!blog) {
            throw new Error(`Blog with id '${blogId}' not found`);
          }
          return blog;
        })
      );
    }
  }

  static async create(body: CreateHomepageDto): Promise<HomepageResponseDto> {
    try {
      const existing = await this.getReadCollectionRef().get();
      if (!existing.empty) {
        throw new Error('Homepage is existed. Can not create new one.');
      }
      // Fetch full product data from product_ids
      const products = await this.populateProducts(body.product_ids);
      const blogs = await this.populateBlogs(body.blog_ids);

      const now = Timestamp.now();
      const docData = {
        title: body.title,
        subtitle: body.subtitle,
        banner: body.banner,
        navigation_bar: body.navigation_bar,
        footer: body.footer,
        slider: body.slider,
        products: products,
        blogs: blogs,
        created_at: now,
        updated_at: now,
      };

      // Create document without converter to avoid validation issues
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with converter for validation
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists || !createdDoc.data()) {
        throw new Error('Failed to retrieve created Homepage');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating Homepage:', error);
      throw new Error(`Failed to create Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async get(): Promise<HomepageResponseDto | null> {
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
      console.error('Error getting all homepages:', error);
      throw new Error(`Failed to get homepages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<HomepageResponseDto | null> {
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
      console.error('Error getting Homepage by ID:', error);
      throw new Error(`Failed to get Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // fix the getAll with pagination like other service
  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<HomepageResponseDto>>> {
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
      console.error('Error getting all homepages:', error);
      throw new Error(`Failed to get homepages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateHomepageDto): Promise<HomepageResponseDto> {
    try {
      // Check if Homepage exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists) {
        throw new Error(`Homepage with id '${id}' not found`);
      }

      // Prepare update fields
      let updateFields: any = {
        ...body,
        updated_at: Timestamp.now(),
      };

      // If product_ids is provided, fetch full product data
      if (body.product_ids !== undefined) {
        const products = await this.populateProducts(body.product_ids);
        updateFields.products = products;

        delete updateFields.product_ids;
      }

      if (body.blog_ids !== undefined) {
        const blogs = await this.populateBlogs(body.blog_ids);
        updateFields.blogs = blogs;

        delete updateFields.blog_ids;
      }

      // Update document
      await this.getWriteCollectionRef().doc(id).update(updateFields);

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated Homepage');
      }

      return updatedDoc.data() || (() => { throw new Error('Failed to parse updated Homepage data'); })();
    } catch (error) {
      console.error('Error updating Homepage:', error);
      throw new Error(`Failed to update Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if Homepage exists
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) {
        throw new Error(`Homepage with id '${id}' not found`);
      }

      // Delete the Homepage
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting Homepage:', error);
      throw new Error(`Failed to delete Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
