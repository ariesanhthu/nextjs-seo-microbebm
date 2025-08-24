import { NextResponse } from "next/server";
import { CategoryService } from "@/services/firebase/category/category.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateCategorySchema } from "@/lib/schemas/category.schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Category ID is required'
      }, { status: 400 });
    }

    const category = await CategoryService.getById(id);
    
    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Category with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching category:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch category');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch category');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/category/[id] - Update category by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Category ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateCategorySchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update category using the service
    const updatedCategory = await CategoryService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update category');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Category not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update category');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/category/[id] - Delete category by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Category ID is required'
      }, { status: 400 });
    }

    // Delete category using the service
    await CategoryService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete category');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Category not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete category');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
