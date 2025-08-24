import { NextResponse } from "next/server";
import { CategoryService } from "@/services/firebase/category/category.service";
import { CreateCategoryDto } from "@/lib/dto/category.dto";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";

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
      count: result.data.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/category - Create a new category
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateCategoryDto = await request.json();

    // Create category using the service
    const newCategory = await CategoryService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
