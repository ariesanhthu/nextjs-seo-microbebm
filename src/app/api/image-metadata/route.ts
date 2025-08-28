import { NextResponse } from "next/server";
import { ImageMetadataService } from "@/services/firebase/image-metadata/image-metadata.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateImageMetadataSchema } from "@/lib/schemas/image-metadata.schema";

// GET /api/image-metadata - Get all categories with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await ImageMetadataService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data?.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    const errorResponse = formatErrorResponse(error, 'Failed to fetch categories');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/image-metadata - Create a new image-metadata
export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateImageMetadataSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Create image-metadata using the service
    const newImageMetadata = await ImageMetadataService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newImageMetadata,
      message: 'ImageMetadata created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating image-metadata:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create image-metadata');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create image-metadata');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
