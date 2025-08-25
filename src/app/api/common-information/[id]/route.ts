import { NextResponse } from "next/server";
import { CommonInformationService } from "@/services/firebase/common-information/common-information.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateCommonInformationSchema } from "@/lib/schemas/common-information.schema";

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
        message: 'CommonInformation ID is required'
      }, { status: 400 });
    }

    const commonInformation = await CommonInformationService.getById(id);
    
    if (!commonInformation) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `CommonInformation with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: commonInformation
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching common-information:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch common-information');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch common-information');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/common-information/[id] - Update common-information by ID
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
        message: 'CommonInformation ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateCommonInformationSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update common-information using the service
    const updatedCommonInformation = await CommonInformationService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedCommonInformation,
      message: 'CommonInformation updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating common-information:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update common-information');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'CommonInformation not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update common-information');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/common-information/[id] - Delete common-information by ID
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
        message: 'CommonInformation ID is required'
      }, { status: 400 });
    }

    // Delete common-information using the service
    await CommonInformationService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'CommonInformation deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting common-information:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete common-information');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'CommonInformation not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete common-information');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
