import { NextResponse } from "next/server";
import { ContactService } from "@/services/firebase/contact/contact.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateContactSchema } from "@/lib/schemas/contact.schema";

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
      count: result.data?.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    const errorResponse = formatErrorResponse(error, 'Failed to fetch contacts');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/contact - Create a new contact
export async function POST(request: Request) {
  try {
    const validatedBody = await ZodRequestValidation(request, CreateContactSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    const newContact = await ContactService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newContact,
      message: 'Contact created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create contact');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create contact');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
