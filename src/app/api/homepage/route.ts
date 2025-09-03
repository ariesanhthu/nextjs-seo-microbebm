import { NextResponse } from "next/server";
import { HomepageService } from "@/services/firebase/homepage/homepage.service";
import { CreateHomepageDto } from "@/lib/dto/homepage.dto";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateHomepageSchema } from "@/lib/schemas/homepage.schema";

export async function GET() {
  try {
    const homepage = await HomepageService.get();
    console.log(homepage);
    return NextResponse.json({
      success: true,
      data: homepage,
    })
  } catch (error) {
    console.error('Error fetching homepages:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch homepages');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch homepages');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateHomepageSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    const newHomepage = await HomepageService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newHomepage,
      message: 'Homepage created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating homepage:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create homepage');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific validation errors
    if (error instanceof Error && error.message.includes('Product with id')) {
      const errorResponse = formatErrorResponse(error, 'Product validation failed');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create homepage');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
