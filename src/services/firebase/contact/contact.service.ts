import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { Timestamp } from 'firebase-admin/firestore';
import { 
  CreateContactDto, 
  UpdateContactDto, 
  ContactResponseDto,
} from '@/lib/dto/contact.dto';
import { ContactSchema } from '@/lib/schemas/contact.schema';
import { PaginationCursorDto, PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';

export class ContactService {
  private static readonly COLLECTION = 'contacts';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(ContactSchema));
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION) 
    }


  static async create(body: CreateContactDto): Promise<ContactResponseDto> {
    try {
      if (!body.email && !body.phone) {
        throw new Error('Must include email or phone');
      }

      const now = Timestamp.now();
      const docData: Partial<ContactResponseDto> = {
        ...body,
        is_check: false,
        created_at: now,
        updated_at: now,
      };

      // Create document
      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document with ID
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists) {
        throw new Error('Failed to retrieve created contact');
      }

      return createdDoc.data()!;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error(`Failed to create contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<ContactResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      return doc.exists ? doc.data()! : null;
    } catch (error) {
      console.error('Error getting contact by ID:', error);
      throw new Error(`Failed to get contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorDto): Promise<Partial<PaginationCursorResponseDto<ContactResponseDto>>> {
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
      console.error('Error getting all contacts:', error);
      throw new Error(`Failed to get contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateContactDto): Promise<ContactResponseDto> {
    try {
      // Check if contact exists
      const existing = await this.getDocRef(id).get();
      if (!existing) {
        throw new Error(`Contact with id '${id}' not found`);
      }

      // Update document
      await this.getWriteCollectionRef().doc(id).update({
        ...body,
        updated_at: Timestamp.now(),
      });

      // Get updated document
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists) {
        throw new Error('Failed to retrieve updated contact');
      }

      return updatedDoc.data()!;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error(`Failed to update contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if contact exists
      const doc = await this.getDocRef(id).get();
      if (!doc) {
        throw new Error(`Contact with id '${id}' not found`);
      }

      // Delete the contact
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error(`Failed to delete contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
