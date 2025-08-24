import { NextResponse } from "next/server";
import { HomepageService } from "@/services/firebase/homepage/homepage.service";
import { UpdateHomepageDto } from "@/lib/dto/homepage.dto";

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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch homepage',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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

    const body: UpdateHomepageDto = await request.json();

    const updatedHomepage = await HomepageService.update(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedHomepage,
      message: 'Homepage updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating homepage:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }

    // Handle specific validation errors
    if (error instanceof Error && error.message.includes('Product with id')) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update homepage',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete homepage',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
