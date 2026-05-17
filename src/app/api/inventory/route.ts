import { NextRequest, NextResponse } from 'next/server';
import { inventoryService } from '@/lib/services/inventoryService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    let items = await inventoryService.getAll();
    
    if (category) {
      items = items.filter(i => i.category === category);
    }
    if (status) {
      items = items.filter(i => i.status === status);
    }
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.category || body.quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, quantity' },
        { status: 400 }
      );
    }
    
    const item = await inventoryService.create({
      ...body,
      unit: body.unit || 'unit',
      location: body.location || 'Storage',
      status: body.quantity <= body.minStock ? 'LOW_STOCK' : 'IN_STOCK',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Inventory item created successfully', item },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }
    
    const item = await inventoryService.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Inventory item updated successfully', item }
    );
  } catch (error: any) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update inventory item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Inventory item ID is required' },
        { status: 400 }
      );
    }

    const deleted = await inventoryService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Inventory item deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    );
  }
}
