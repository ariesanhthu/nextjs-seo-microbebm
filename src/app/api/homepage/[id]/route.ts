import { NextResponse } from "next/server";
import { HomepageService } from "@/services/firebase/homepage/homepage.service";
import { UpdateHomepageDto } from "@/lib/dto/homepage.dto";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateHomepageSchema } from "@/lib/schemas/homepage.schema";

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
        message: 'Homepage ID is required'
      }, { status: 400 });
    }

    const homepage = await HomepageService.getById(id);
    
    if (!homepage) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Homepage with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: homepage
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching homepage:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch homepage');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch homepage');
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
        message: 'Homepage ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateHomepageSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    const updatedHomepage = await HomepageService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedHomepage,
      message: 'Homepage updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating homepage:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update homepage');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    // Handle specific validation errors first
    if (error instanceof Error && (error.message.includes('Product with id') || error.message.includes('Blog with id'))) {
      const errorResponse = formatErrorResponse(error, 'Related resource validation failed');
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle homepage not found explicitly
    if (error instanceof Error && error.message.includes("Homepage with id")) {
      const errorResponse = formatErrorResponse(error, 'Homepage not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update homepage');
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
        message: 'Homepage ID is required'
      }, { status: 400 });
    }

    await HomepageService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Homepage deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting homepage:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete homepage');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Homepage not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete homepage');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
