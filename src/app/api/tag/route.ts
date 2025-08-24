import { NextResponse } from "next/server";
import { TagService } from "@/services/firebase/tag/tag.service";
import { CreateTagDto } from "@/lib/dto/tag.dto";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";

// GET /api/tag - Get all tags with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await TagService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data.length
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
