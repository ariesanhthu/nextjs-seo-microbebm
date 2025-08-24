import { NextResponse } from "next/server";
import { BlogService } from "@/services/firebase/blog/blog.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateBlogSchema } from "@/lib/schemas/blog.schema";

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
        message: 'Blog ID is required'
      }, { status: 400 });
    }

    const blog = await BlogService.getById(id);
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Blog with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: blog
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch blog');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch blog');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/blog/[id] - Update blog by ID
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
        message: 'Blog ID is required'
      }, { status: 400 });
    }

    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateBlogSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update blog using the service
    const updatedBlog = await BlogService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update blog');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Blog not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update blog');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/blog/[id] - Delete blog by ID
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
        message: 'Blog ID is required'
      }, { status: 400 });
    }

    // Delete blog using the service
    await BlogService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete blog');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Blog not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete blog');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
