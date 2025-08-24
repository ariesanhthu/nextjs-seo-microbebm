import { NextResponse } from "next/server";
import { BlogService } from "@/services/firebase/blog/blog.service";
import { CreateBlogDto } from "@/lib/dto/blog.dto";
import { PaginationCursorDto } from "@/lib/dto/pagination.dto";
import { ESort } from "@/lib/enums/sort.enum";

// GET /api/blog - Get all blogs with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: PaginationCursorDto = {
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      sort: (searchParams.get('sort') as ESort) || ESort.DESC
    };

    const result = await BlogService.getAll(query);
    
    return NextResponse.json({
      success: true,
      data: result.data,
      nextCursor: result.nextCursor,
      hasNextPage: result.hasNextPage,
      count: result.data.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blogs',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/blog - Create a new blog
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateBlogDto = await request.json();

    // Create blog using the service
    const newBlog = await BlogService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newBlog,
      message: 'Blog created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create blog',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
