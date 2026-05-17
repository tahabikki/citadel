import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/services/taskService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    let tasks = await taskService.getAll();
    
    if (status) {
      tasks = tasks.filter(t => t.status === status);
    }
    if (type) {
      tasks = tasks.filter(t => t.type === type);
    }
    
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.type || !body.reservationId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, reservationId' },
        { status: 400 }
      );
    }
    
    const task = await taskService.create({
      ...body,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Task created successfully', task },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
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
    
    const task = await taskService.update(id, updates);

    return NextResponse.json(
      { message: 'Task updated successfully', task }
    );
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
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

    const deleted = await taskService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Task deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}