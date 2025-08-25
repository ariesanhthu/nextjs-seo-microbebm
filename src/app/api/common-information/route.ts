import { NextResponse } from "next/server";
import { CommonInformationService } from "@/services/firebase/common-information/common-information.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateCommonInformationSchema } from "@/lib/schemas/common-information.schema";

// GET /api/common-information - Get all common-informations with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await CommonInformationService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching common-informations:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch common-informations');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch common-informations');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/common-information - Create a new common-information
export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateCommonInformationSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Create common-information using the service
    const newCommonInformation = await CommonInformationService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newCommonInformation,
      message: 'CommonInformation created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating common-information:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create common-information');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create common-information');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
