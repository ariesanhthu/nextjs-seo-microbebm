import { NextResponse } from "next/server";
import { CategoryService } from "@/services/firebase/category/category.service";
import { UpdateCategoryDto } from "@/lib/dto/category.dto";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/category/[id] - Update category by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Category ID is required'
      }, { status: 400 });
    }

    // Destructure the request body
    const body = await request.json();
    const updateData = body as UpdateCategoryDto;
    
    // Validate that there's at least one field to update
    if (!updateData.name) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'At least one field (name) must be provided for update'
      }, { status: 400 });
    }

    // Update category using the service
    const updatedCategory = await CategoryService.update(id, updateData);
    
    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/category/[id] - Delete category by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
