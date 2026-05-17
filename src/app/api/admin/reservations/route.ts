import { NextRequest, NextResponse } from 'next/server';
import { requireRole, UserRole } from '@/lib/auth';
import {
  listAdminReservations,
  updateAdminReservationAction
} from '@/lib/services/adminReservationsApiService';

export async function GET(request: NextRequest) {
  try {
    await requireRole([UserRole.ADMIN, UserRole.STAFF]);

    const { searchParams } = new URL(request.url);
    const reservations = await listAdminReservations({
      status: searchParams.get('status'),
      date: searchParams.get('date')
    });

    return NextResponse.json({ reservations });
  } catch (error: any) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reservations' },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireRole([UserRole.ADMIN, UserRole.STAFF]);

    const body = await request.json();
    const { reservationId, action } = body;

    if (!reservationId || !action) {
      return NextResponse.json(
        { error: 'Missing reservationId or action' },
        { status: 400 }
      );
    }

    const result = await updateAdminReservationAction({
      reservationId,
      action,
      userId: session.userId
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Update reservation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update reservation' },
      { status: 400 }
    );
  }
}
