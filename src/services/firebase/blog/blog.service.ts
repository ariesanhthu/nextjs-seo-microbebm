import { adminDb } from '@/services/firebase/firebase-admin';
import { zodAdminConverter } from '@/services/zod/zod-admin-converter';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { 
  CreateBlogDto, 
  UpdateBlogDto, 
  BlogResponseDto,
  PaginationCursorBlogDto,
} from '@/lib/dto/blog.dto';
import { BlogSchema } from '@/lib/schemas/blog.schema';
import { generateSlug } from '@/utils/generate-slug';
import { PaginationCursorResponseDto } from '@/lib/dto/pagination.dto';
import { ESort } from '@/lib/enums/sort.enum';

export class BlogService {
  private static readonly COLLECTION = 'blogs';

  private static getReadCollectionRef() {
    return adminDb
      .collection(this.COLLECTION)
      .withConverter(zodAdminConverter(BlogSchema));
  }

  private static getWriteCollectionRef() {
    return adminDb.collection(this.COLLECTION)
  }

  private static getDocRef(id: string) {
    return this.getReadCollectionRef().doc(id);
  }

  private static async populateTag(doc: any): Promise<any> {
    // Fetch detail data of tag, 
    // Exclude null doc
    const tags = (await Promise.all(
      doc.tag_refs.map(async (ref: DocumentReference) => {
        const tagDoc = await ref.get();
        if (!tagDoc.exists) return null;

        return {
          id: tagDoc.id,
          name: tagDoc.data()?.name,
          slug: tagDoc.data()?.slug,
        }
      })
    )).filter((tag: any) => tag !== null);

    const {tag_refs, ...body} = doc;
    return {
      ...body,
      tags
    }
  }

  private static async getListRef(listIds: string[]) {
    const uniqueIds = [... (new Set(listIds))];
    const listRef = await Promise.all(
      uniqueIds.map(async (id) => {
        const doc = await adminDb.collection('tags').doc(id).get();
        if (!doc.exists) {
          throw new Error(`Tag with ID '${id}' now found`);
        }
        return adminDb.collection('tags').doc(id);
      })
    )
    return listRef;
  }


  static async create(body: CreateBlogDto): Promise<BlogResponseDto> {
    try {
      // Convert tag_ids to DocumentReferences
      const tagRefs = await this.getListRef(body.tag_ids);
      
      const now = Timestamp.now();
      const docData = {
        title: body.title,
        content: body.content,
        author: body.author,
        tag_refs: tagRefs,
        slug: generateSlug([body.title]),
        created_at: now,
        updated_at: now,
        thumbnail_url: body.thumbnail_url,
        status: body.status,
        is_featured: body.is_featured || false,
        excerpt: body.excerpt || "",
        search: generateSlug([body.title, body.author, body.excerpt], ' ')
      };

      const docRef = await this.getWriteCollectionRef().add(docData);
      
      // Get the created document and populate references
      const createdDoc = await this.getDocRef(docRef.id).get();
      if (!createdDoc.exists || !createdDoc.data()) {
        throw new Error('Failed to retrieve created Blog');
      }

      return await this.populateTag(createdDoc.data()) as BlogResponseDto;
    } catch (error) {
      console.error('Error creating Blog:', error);
      throw new Error(`Failed to create Blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getById(id: string): Promise<BlogResponseDto | null> {
    try {
      const doc = await this.getDocRef(id).get();
      if (!doc.exists) return null;
      
      try {
        const data = doc.data();
        if (!data) return null;
        return await this.populateTag(data) as BlogResponseDto;
      } catch (error) {
        return null;
      }
    } catch (error) {
      console.error('Error getting Blog by ID:', error);
      throw new Error(`Failed to get Blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async getAll(query: PaginationCursorBlogDto): Promise<Partial<PaginationCursorResponseDto<BlogResponseDto>>> {
    try {
      const {
        cursor,
        limit = 10,
        sort = ESort.DESC,
        search,
        tags,
        status
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
      // Filter by tags if provided
      if (tags && tags.length > 0) {
        queryRef = queryRef.where('tags', 'array-contains-any', tags);
      }

      if (status) {
        queryRef = queryRef.where('status', '==', status);
      }


      const snapshot = await queryRef.get();
      let allDocs = (await Promise.all(
        snapshot.docs.map(async (doc: any) => {
          try {
            const rawData = doc.data();
            if (rawData === null) return null;
            const dataWithId = { id: doc.id, ...rawData };
            return await this.populateTag(dataWithId) as BlogResponseDto;
          } catch (error) {
            // If converter returns null or throws error, skip this document
            return null;
          }
        })
      )).filter((doc): doc is BlogResponseDto => doc !== null);

      if (search) {
        const normalizedSearch = generateSlug([search], ' ');
        allDocs = allDocs.filter(doc => doc.search.includes(normalizedSearch));
      }

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
      console.error('Error getting all blogs:', error);
      throw new Error(`Failed to get blogs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async update(id: string, body: UpdateBlogDto): Promise<BlogResponseDto> {
    try {
      // Check if Blog exists
      const existing = await this.getDocRef(id).get();
      if (!existing.exists || !existing.data()) {
        throw new Error(`Blog with id '${id}' not found`);
      }

      const existingData = existing.data();
      const slug = body.title ? generateSlug([body.title]) : existingData?.slug;
      
      // Convert tag_ids to DocumentReferences if provided
      let updateFields: any = {
        ...body,
        slug: slug,
        search: generateSlug(
          [
            body?.title || existing.data()?.title || "", 
            body.author || existing.data()?.author || "", 
            body.excerpt || existing.data()?.excerpt || ""
          ], ' '),
        updated_at: Timestamp.now(),
      };
      
      if (body.tag_ids) {
        updateFields.tag_refs = await this.getListRef(body.tag_ids);
        delete updateFields.tag_ids;
      }

      // Auto-generate excerpt if content changes and excerpt is not provided
      if (body.content && !body.excerpt) {
        updateFields.excerpt = body.content.substring(0, 200);
      }
   
      // Update document
      await this.getWriteCollectionRef().doc(id).update(updateFields);

      // Get updated document and populate references
      const updatedDoc = await this.getDocRef(id).get();
      if (!updatedDoc.exists || !updatedDoc.data()) {
        throw new Error('Failed to retrieve updated Blog');
      }

      return await this.populateTag(updatedDoc.data()) as BlogResponseDto;
    } catch (error) {
      console.error('Error updating Blog:', error);
      throw new Error(`Failed to update Blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // Check if Blog exists
      const doc = await this.getDocRef(id).get();
      if (!doc.exists || !doc.data()) {
        throw new Error(`Blog with id '${id}' not found`);
      }

      // Delete the Blog
      await this.getDocRef(id).delete();
    } catch (error) {
      console.error('Error deleting Blog:', error);
      throw new Error(`Failed to delete Blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
