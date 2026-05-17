import { NextRequest, NextResponse } from 'next/server';
import { reservationService } from '@/lib/services/reservationService';
import { roomService } from '@/lib/services/roomService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const roomId = searchParams.get('roomId');
    const all = searchParams.get('all');
    
    let reservations = await reservationService.getAll();
    
    if (status) {
      reservations = reservations.filter(r => r.status === status);
    }
    if (roomId) {
      reservations = reservations.filter(r => r.roomId === roomId);
    }
    
    void all;
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { roomId, checkIn, checkOut, guests, adults, children, specialRequests, guestName, guestEmail, guestPhone } = body;
    
    if (!roomId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields: roomId, checkIn, checkOut, guests' },
        { status: 400 }
      );
    }
    
    const room = await roomService.getById(roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return NextResponse.json({ error: 'Invalid dates' }, { status: 400 });
    }
    const nights = Math.max(
      1,
      Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = Number(room.price) * nights;
    
    const reservation = await reservationService.create({
      roomId,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests: Number(guests),
      adults: adults !== undefined ? Number(adults) : 2,
      children: children !== undefined ? Number(children) : 0,
      guestName: guestName || 'Guest',
      guestEmail: guestEmail || '',
      guestPhone: guestPhone || '',
      specialRequests: specialRequests || '',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Reservation created successfully', reservation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create reservation' },
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
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }
    
    const reservation = await reservationService.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Reservation updated successfully', reservation }
    );
  } catch (error: any) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { reservationId, action } = body || {};

    if (!reservationId || !action) {
      return NextResponse.json({ error: 'Missing reservationId or action' }, { status: 400 });
    }

    const existing = await reservationService.getById(String(reservationId));
    if (!existing) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    if (action === 'check-in') {
      const reservation = await reservationService.update(String(reservationId), { status: 'CHECKED_IN', updatedAt: now });
      return NextResponse.json({ reservation });
    }
    if (action === 'check-out') {
      const reservation = await reservationService.update(String(reservationId), { status: 'CHECKED_OUT', updatedAt: now });
      return NextResponse.json({ reservation });
    }
    if (action === 'cancel') {
      const reservation = await reservationService.update(String(reservationId), { status: 'CANCELLED', updatedAt: now });
      return NextResponse.json({ reservation });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error patching reservation:', error);
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    const deleted = await reservationService.delete(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Reservation deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservation' },
      { status: 500 }
    );
  }
}
