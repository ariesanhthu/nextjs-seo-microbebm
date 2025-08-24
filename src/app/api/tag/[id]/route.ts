import { NextResponse } from "next/server";
import { TagService } from "@/services/firebase/tag/tag.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateTagSchema } from "@/lib/schemas/tag.schema";

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
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch tag');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch tag');
    return NextResponse.json(errorResponse, { status: 500 });
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
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateTagSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update tag using the service
    const updatedTag = await TagService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedTag,
      message: 'Tag updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating tag:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update tag');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Tag not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update tag');
    return NextResponse.json(errorResponse, { status: 500 });
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
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete tag');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Tag not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete tag');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
