import { NextResponse } from "next/server";
import { TagService } from "@/services/firebase/tag/tag.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateTagSchema } from "@/lib/schemas/tag.schema";

// GET /api/tag - Get all tags with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await TagService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data?.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch tags');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch tags');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/tag - Create a new tag
export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateTagSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Create tag using the service
    const newTag = await TagService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newTag,
      message: 'Tag created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create tag');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create tag');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
