import { NextResponse } from "next/server";
import { ProductService } from "@/services/firebase/product/product.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateProductSchema } from "@/lib/schemas/product.schema";

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
        message: 'Product ID is required'
      }, { status: 400 });
    }

    const product = await ProductService.getById(id);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Product with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: product
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to fetch product');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to fetch product');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/product/[id] - Update product by ID
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
        message: 'Product ID is required'
      }, { status: 400 });
    }
    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateProductSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update product using the service
    const updatedProduct = await ProductService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update product');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Product not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update product');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/product/[id] - Delete product by ID
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
        message: 'Product ID is required'
      }, { status: 400 });
    }

    // Delete product using the service
    await ProductService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to delete product');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Product not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete product');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
