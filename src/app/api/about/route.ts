import { NextResponse } from "next/server";
import { AboutService } from "@/services/firebase/about/about.service";
import { CreateAboutDto } from "@/lib/dto/about.dto";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { CreateAboutSchema } from "@/lib/schemas/about.schema";

export async function GET() {
  try {
    const about = await AboutService.get();
    return NextResponse.json({
      success: true,
      data: about || null,
    })
  } catch (error) {
    console.error('Error fetching abouts:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch abouts');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch abouts');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, CreateAboutSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    const newAbout = await AboutService.create(validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: newAbout,
      message: 'About created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating about:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to create about');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific validation errors
    if (error instanceof Error && error.message.includes('Product with id')) {
      const errorResponse = formatErrorResponse(error, 'Product validation failed');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to create about');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
