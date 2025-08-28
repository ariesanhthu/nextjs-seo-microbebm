import { NextResponse } from "next/server";
import { CategoryService } from "@/services/firebase/category/category.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateCategorySchema } from "@/lib/schemas/category.schema";

// GET /api/category - Get all categories with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await CategoryService.getAll(query);
    
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

// POST /api/category - Create a new category
export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateCategorySchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Create category using the service
    const newCategory = await CategoryService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create category');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create category');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
