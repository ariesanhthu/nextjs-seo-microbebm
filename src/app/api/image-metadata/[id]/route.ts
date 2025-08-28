import { NextResponse } from "next/server";
import { ImageMetadataService } from "@/services/firebase/image-metadata/image-metadata.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateImageMetadataSchema } from "@/lib/schemas/image-metadata.schema";

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
        message: 'ImageMetadata ID is required'
      }, { status: 400 });
    }

    const imageMetadata = await ImageMetadataService.getById(id);
    
    if (!imageMetadata) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `ImageMetadata with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: imageMetadata
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching image-metadata:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch image-metadata');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch image-metadata');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/image-metadata/[id] - Update image-metadata by ID
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
        message: 'ImageMetadata ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateImageMetadataSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update image-metadata using the service
    const updatedImageMetadata = await ImageMetadataService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedImageMetadata,
      message: 'ImageMetadata updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating image-metadata:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update image-metadata');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'ImageMetadata not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update image-metadata');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/image-metadata/[id] - Delete image-metadata by ID
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
        message: 'ImageMetadata ID is required'
      }, { status: 400 });
    }

    // Delete image-metadata using the service
    await ImageMetadataService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'ImageMetadata deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting image-metadata:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete image-metadata');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'ImageMetadata not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete image-metadata');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
