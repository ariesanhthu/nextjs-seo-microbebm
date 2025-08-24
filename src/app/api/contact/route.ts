import { NextResponse } from "next/server";
import { ContactService } from "@/services/firebase/contact/contact.service";
import { CreateContactDto } from "@/lib/dto/contact.dto";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";

// GET /api/contact - Get all contacts with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await ContactService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contacts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/contact - Create a new contact
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateContactDto = await request.json();

    // Create contact using the service
    const newContact = await ContactService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create contact',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
