import { NextResponse } from "next/server";
import { TagService } from "@/services/firebase/tag/tag.service";
import { CreateTagDto } from "@/lib/dto/tag.dto";

// GET /api/tag - Get all tags
export async function GET(request: Request) {
  try {
    const tags = await TagService.getAll();
    
    return NextResponse.json({
      success: true,
      data: tags,
      count: tags.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tags',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/tag - Create a new tag
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateTagDto = await request.json();

    // Create tag using the service
    const newTag = await TagService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newTag,
      message: 'Tag created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create tag',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
