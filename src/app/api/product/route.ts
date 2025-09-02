import { NextResponse } from "next/server";
import { ProductService } from "@/services/firebase/product/product.service";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateProductSchema } from "@/lib/schemas/product.schema";
import { PaginationCursorProductDto } from "@/lib/dto/product.dto";

// GET /api/product - Get all products with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorProductDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC,
      categories: searchParams.get('tags') ? searchParams.getAll('categorues') : undefined,
      search: searchParams.get('search') || undefined
    };

    const result = await ProductService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data?.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch products');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch products');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/product - Create a new product
export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateProductSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Create product using the service
    const newProduct = await ProductService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create product');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create product');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
