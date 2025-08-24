import { NextResponse } from "next/server";
import { ContactService } from "@/services/firebase/contact/contact.service";
import { UpdateContactDto } from "@/lib/dto/contact.dto";

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
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch contact',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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

    // Destructure the request body
    const body: UpdateContactDto = await request.json();

    // Update contact using the service
    const updatedContact = await ContactService.update(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact:', error);
    
    // Handle specific error cases
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update contact',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
      return NextResponse.json({
        success: false,
        error: 'Not found',
        message: error.message
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete contact',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
