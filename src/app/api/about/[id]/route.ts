import { NextResponse } from "next/server";
import { AboutService } from "@/services/firebase/about/about.service";
import { UpdateAboutDto } from "@/lib/dto/about.dto";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateAboutSchema } from "@/lib/schemas/about.schema";

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
        message: 'About ID is required'
      }, { status: 400 });
    }

    const about = await AboutService.getById(id);
    
    if (!about) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `About with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: about
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching about:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch about');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch about');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

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
        message: 'About ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateAboutSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    const updatedAbout = await AboutService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedAbout,
      message: 'About updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating about:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update about');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'About not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Handle specific validation errors
    if (error instanceof Error && error.message.includes('Product with id')) {
      const errorResponse = formatErrorResponse(error, 'Product validation failed');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update about');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

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
        message: 'About ID is required'
      }, { status: 400 });
    }

    await AboutService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'About deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting about:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete about');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'About not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete about');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
