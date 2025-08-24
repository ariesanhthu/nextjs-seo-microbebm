import { NextResponse } from "next/server";
import { ContactService } from "@/services/firebase/contact/contact.service";
import { formatErrorResponse } from "@/lib/format-error-response";
import { ZodError } from "zod";
import { ZodRequestValidation } from "@/services/zod/zod-validation-request";
import { UpdateContactSchema } from "@/lib/schemas/contact.schema";

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
        message: 'Contact ID is required'
      }, { status: 400 });
    }

    const contact = await ContactService.getById(id);
    
    if (!contact) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: `Contact with ID '${id}' not found`
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: contact
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contact:', error);
    const errorResponse = formatErrorResponse(error, 'Failed to fetch contact');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/contact/[id] - Update contact by ID
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
        message: 'Contact ID is required'
      }, { status: 400 });
    }

    // Validate request body
    const validatedBody = await ZodRequestValidation(request, UpdateContactSchema);
    if (validatedBody.success === false) {
      throw validatedBody.error;
    }

    // Update contact using the service
    const updatedContact = await ContactService.update(id, validatedBody.data);
    
    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    
    // Handle validation errors with 400 status
    if (error instanceof ZodError) {
      const errorResponse = formatErrorResponse(error, 'Failed to update contact');
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Contact not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to update contact');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/contact/[id] - Delete contact by ID
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
        message: 'Contact ID is required'
      }, { status: 400 });
    }

    // Delete contact using the service
    await ContactService.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      const errorResponse = formatErrorResponse(error, 'Contact not found');
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // Handle other errors with 500 status
    const errorResponse = formatErrorResponse(error, 'Failed to delete contact');
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
