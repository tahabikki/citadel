import { NextRequest, NextResponse } from 'next/server';
import { roomService } from '@/lib/services/roomService';
import { reservationService } from '@/lib/services/reservationService';

function toApiRoom(room: any) {
  const images = Array.isArray(room.images) ? room.images : [];
  return {
    id: String(room.id),
    roomNumber: String(room.roomNumber || room.id),
    name: room.name,
    type: room.type,
    price: room.price,
    maxGuests: room.maxGuests,
    status: room.status,
    available: room.status === 'AVAILABLE',
    imageUrl: images[0] || room.imageUrl || null,
    amenities: room.amenities || [],
    description: room.description || '',
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const type = searchParams.get('type');
    const includeAll = searchParams.get('includeAll');
    const status = searchParams.get('status');
    
    let rooms = await roomService.getAll();
    
    if (includeAll !== 'true') {
      rooms = rooms.filter(room => room.status === 'AVAILABLE');
    }
    
    if (status) {
      rooms = rooms.filter(room => room.status === status);
    }
    
    if (type) {
      rooms = rooms.filter(room => room.type === type.toUpperCase());
    }
    
    if (guests) {
      rooms = rooms.filter(room => room.maxGuests >= parseInt(guests));
    }
    
    if (checkIn && checkOut) {
      const reservations = await reservationService.getAll();
      const conflictingRoomIds = reservations
        .filter(r => {
          if (r.status === 'CANCELLED') return false;
          const resCheckIn = new Date(r.checkIn);
          const resCheckOut = new Date(r.checkOut);
          const reqCheckIn = new Date(checkIn);
          const reqCheckOut = new Date(checkOut);
          return (reqCheckIn < resCheckOut && reqCheckOut > resCheckIn);
        })
        .map(r => r.roomId);
      
      rooms = rooms.filter(room => !conflictingRoomIds.includes(room.id));
    }
    
    return NextResponse.json({ rooms: rooms.map(toApiRoom) });
  } catch (error) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const room = await roomService.create({
      roomNumber: body.roomNumber || body.id,
      name: body.name,
      type: String(body.type || '').toUpperCase(),
      price: Number(body.price),
      maxGuests: Number(body.maxGuests),
      description: body.description || '',
      amenities: body.amenities || [],
      images: body.images || (body.imageUrl ? [body.imageUrl] : []),
      status: 'AVAILABLE',
      available: true,
      beds: body.beds || '1 bed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Room created successfully', room: toApiRoom(room) },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create room error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create room' },
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
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }
    
    const room = await roomService.update(id, {
      ...updates,
      type: updates.type ? String(updates.type).toUpperCase() : undefined,
      price: updates.price !== undefined ? Number(updates.price) : undefined,
      maxGuests: updates.maxGuests !== undefined ? Number(updates.maxGuests) : undefined,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Room updated successfully', room: toApiRoom(room) }
    );
  } catch (error: any) {
    console.error('Update room error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update room' },
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
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const deleted = await roomService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Room deleted successfully' }
    );
  } catch (error) {
    console.error('Delete room error:', error);
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    );
  }
}
