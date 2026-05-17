import { NextRequest, NextResponse } from 'next/server';
import { pricingService } from '@/lib/services/pricingService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const roomType = searchParams.get('roomType');
    
    let rates = await pricingService.getAll();
    
    if (isActive !== null) {
      rates = rates.filter(r => r.isActive === (isActive === 'true'));
    }
    if (roomType) {
      rates = rates.filter(r => r.roomType === roomType);
    }
    
    return NextResponse.json({ rates });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.startDate || !body.endDate || body.multiplier === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate, multiplier' },
        { status: 400 }
      );
    }
    
    const rate = await pricingService.create({
      ...body,
      isActive: body.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Seasonal rate created successfully', rate },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating seasonal rate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create seasonal rate' },
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
        { error: 'Rate ID is required' },
        { status: 400 }
      );
    }
    
    const rate = await pricingService.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Seasonal rate updated successfully', rate }
    );
  } catch (error: any) {
    console.error('Error updating seasonal rate:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update seasonal rate' },
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
        { error: 'Rate ID is required' },
        { status: 400 }
      );
    }

    const deleted = await pricingService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Seasonal rate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Seasonal rate deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting seasonal rate:', error);
    return NextResponse.json(
      { error: 'Failed to delete seasonal rate' },
      { status: 500 }
    );
  }
}