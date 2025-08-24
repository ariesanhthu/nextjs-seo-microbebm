import { NextResponse } from "next/server";
import { TagService } from "@/services/firebase/tag/tag.service";
import { UpdateTagDto } from "@/lib/dto/tag.dto";

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
        message: 'Tag ID is required'
      }, { status: 400 });
    }

    const tag = await TagService.getById(id);
    
    if (!tag) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Tag with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: tag
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tag',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/tag/[id] - Update tag by ID
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
        message: 'Tag ID is required'
      }, { status: 400 });
    }

    // Destructure the request body
    const body: UpdateTagDto = await request.json();

    // Update tag using the service
    const updatedTag = await TagService.update(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedTag,
      message: 'Tag updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);
    
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
      error: 'Failed to update tag',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/tag/[id] - Delete tag by ID
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
        message: 'Tag ID is required'
      }, { status: 400 });
    }

    // Delete tag using the service
    await TagService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting tag:', error);
    
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
      error: 'Failed to delete tag',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
