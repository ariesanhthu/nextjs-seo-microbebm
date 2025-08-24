import { NextResponse } from "next/server";
import { ProductService } from "@/services/firebase/product/product.service";
import { CreateProductDto } from "@/lib/dto/product.dto";

// GET /api/product - Get all products
export async function GET(request: Request) {
  try {
    const products = await ProductService.getAll();
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/product - Create a new product
export async function POST(request: Request) {
  try {
    // Destructure the request body
    const body: CreateProductDto = await request.json();

    // Create product using the service
    const newProduct = await ProductService.create(body);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create product',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
