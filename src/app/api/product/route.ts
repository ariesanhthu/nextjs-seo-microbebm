import { NextResponse } from "next/server";
import { ProductService } from "@/services/firebase/product/product.service";
import { CreateProductDto } from "@/lib/dto/product.dto";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";

// GET /api/product - Get all products with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await ProductService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/product - Create a new product
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateProductDto = await request.json();

    // Create product using the service
    const newProduct = await ProductService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
