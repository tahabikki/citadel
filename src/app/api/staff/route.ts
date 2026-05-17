import { NextRequest, NextResponse } from 'next/server';
import { staffService } from '@/lib/services/staffService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const department = searchParams.get('department');
    
    let staff = await staffService.getAll();
    
    if (status) {
      staff = staff.filter(s => s.status === status);
    }
    if (role) {
      staff = staff.filter(s => s.role === role);
    }
    if (department) {
      staff = staff.filter(s => s.department === department);
    }
    
    return NextResponse.json({ staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const name = body.name || [body.firstName, body.lastName].filter(Boolean).join(' ').trim();

    if (!name || !body.email || !body.role) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, role' },
        { status: 400 }
      );
    }
    
    const staffMember = await staffService.create({
      ...body,
      name,
      status: 'ACTIVE',
      hireDate: body.hireDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Staff created successfully', staff: staffMember },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create staff' },
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
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }
    
    const staffMember = await staffService.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Staff updated successfully', staff: staffMember }
    );
  } catch (error: any) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update staff' },
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
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const deleted = await staffService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Staff deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff' },
      { status: 500 }
    );
  }
}
