import { NextRequest, NextResponse } from 'next/server';
import { housekeepingService } from '@/lib/services/housekeepingService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let tasks = await housekeepingService.getAll();
    
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (type) {
      tasks = tasks.filter(t => t.type === type);
    }
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching housekeeping tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch housekeeping tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const roomNumber = body.roomNumber || body.roomId;
    const type = body.type || 'CLEANING';

    if (!roomNumber || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: roomNumber, type' },
        { status: 400 }
      );
    }
    
    const task = await housekeepingService.create({
      ...body,
      roomNumber,
      type,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Housekeeping task created successfully', task },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating housekeeping task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create housekeeping task' },
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
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    const task = await housekeepingService.update(id, updates);

    return NextResponse.json(
      { message: 'Housekeeping task updated successfully', task }
    );
  } catch (error: any) {
    console.error('Error updating housekeeping task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update housekeeping task' },
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
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }

    const deleted = await housekeepingService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Housekeeping task deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting housekeeping task:', error);
    return NextResponse.json(
      { error: 'Failed to delete housekeeping task' },
      { status: 500 }
    );
  }
}
