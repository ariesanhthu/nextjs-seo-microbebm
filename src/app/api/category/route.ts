import { NextResponse } from "next/server";
import { CategoryService } from "@/services/firebase/category/category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "@/lib/dto/category.dto";

// GET /api/category - Get all categories
export async function GET(request: Request) {
  try {
    const categories = await CategoryService.getAll();
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length
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
    const body = await request.json();
    const { name } = body as CreateCategoryDto;
    
    // Validate required fields
    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Name is required'
      }, { status: 400 });
    }

    // Create category using the service
    const newCategory = await CategoryService.create({ name });
    
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
