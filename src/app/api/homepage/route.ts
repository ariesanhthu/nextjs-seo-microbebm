import { NextResponse } from "next/server";
import { HomepageService } from "@/services/firebase/homepage/homepage.service";
import { CreateHomepageDto } from "@/lib/dto/homepage.dto";

export async function GET() {
  try {
    const homepages = await HomepageService.getAll();
    
    return NextResponse.json({
      success: true,
      data: homepages,
      count: homepages.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching homepages:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch homepages',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateHomepageDto = await request.json();

    const newHomepage = await HomepageService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newHomepage,
      message: 'Homepage created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage:', error);
    
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
      error: 'Failed to create homepage',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
