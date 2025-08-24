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

  static async create(body: CreateHomepageDto): Promise<HomepageResponseDto> {
    try {
      // Fetch full product data from product_ids
      const products = await this.populateProducts(body.product_ids);
      
      const now = Timestamp.now();
      const docData = {
        navigation_bar: body.navigation_bar,
        footer: body.footer,
        slider: body.slider,
        products: products,
        created_at: now,
        updated_at: now,
      };

      // Create document without converter to avoid validation issues
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with converter for validation
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists) {
        throw new Error('Failed to retrieve created Homepage');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating Homepage:', error);
      throw new Error(`Failed to create Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<HomepageResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) {
        return null;
      }
      
      return doc.data()!;
    } catch (error) {
      console.error('Error getting Homepage by ID:', error);
      throw new Error(`Failed to get Homepage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(): Promise<HomepageResponseDto[]> {
    try {
      const snapshot = await this.getReadCollectionRef().get();
      return snapshot.docs.map(doc => doc.data()!);
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
        const products = this.populateProducts(body.product_ids);
        updateFields.products = products;

        delete updateFields.product_ids;
      }

      // Update document
      await this.getWriteCollectionRef().doc(id).update(updateFields);

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated Homepage');
      }

      return updatedDoc.data()!;
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
