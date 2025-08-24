import { NextResponse } from "next/server";
import { BlogService } from "@/services/firebase/blog/blog.service";
import { UpdateBlogDto } from "@/lib/dto/blog.dto";

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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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

    // Destructure the request body
    const body: UpdateBlogDto = await request.json();

    // Update blog using the service
    const updatedBlog = await BlogService.update(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedBlog,
      message: 'Blog updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating blog:', error);
    
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
      error: 'Failed to update blog',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
      error: 'Failed to delete blog',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
