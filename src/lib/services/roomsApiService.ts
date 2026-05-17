import { prisma } from '@/lib/prisma';

type RoomFilters = {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: string | null;
  roomType?: string | null;
};

export async function listAvailableRooms(filters: RoomFilters) {
  const where: any = { available: true };

  if (filters.roomType) {
    where.type = filters.roomType.toUpperCase();
  }

  if (filters.guests) {
    where.maxGuests = { gte: parseInt(filters.guests, 10) };
  }

  if (filters.checkIn && filters.checkOut) {
    const checkInDate = new Date(filters.checkIn);
    const checkOutDate = new Date(filters.checkOut);

    const conflictingReservations = await prisma.reservation.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
        OR: [
          {
            checkIn: { lte: checkOutDate },
            checkOut: { gte: checkInDate }
          }
        ]
      },
      select: { roomId: true }
    });

    const occupiedRoomIds = conflictingReservations.map((r) => r.roomId);
    where.id = { notIn: occupiedRoomIds };
  }

  return prisma.room.findMany({
    where,
    orderBy: { price: 'asc' }
  });
}

type CreateReservationInput = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults?: number;
  children?: number;
  specialRequests?: string;
};

type SessionUser = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export async function createReservationForSession(
  session: SessionUser,
  input: CreateReservationInput
) {
  const checkInDate = new Date(input.checkIn);
  const checkOutDate = new Date(input.checkOut);

  if (checkInDate >= checkOutDate) {
    throw new Error('Check-out must be after check-in');
  }

  if (checkInDate < new Date()) {
    throw new Error('Check-in date cannot be in the past');
  }

  const room = await prisma.room.findUnique({
    where: { id: input.roomId }
  });

  if (!room || !room.available) {
    throw new Error('Room not available');
  }

  if (input.guests > room.maxGuests) {
    throw new Error(`Maximum ${room.maxGuests} guests allowed`);
  }

  const conflictingReservations = await prisma.reservation.findMany({
    where: {
      roomId: input.roomId,
      status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] },
      OR: [
        {
          checkIn: { lte: checkOutDate },
          checkOut: { gte: checkInDate }
        }
      ]
    }
  });

  if (conflictingReservations.length > 0) {
    throw new Error('Room is not available for selected dates');
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = Number(room.price) * nights;

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.userId,
      roomId: input.roomId,
      guestName: `${session.firstName || 'Guest'} ${session.lastName || ''}`.trim(),
      guestEmail: session.email,
      guestPhone: '',
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: input.guests,
      adults: input.adults || 2,
      children: input.children || 0,
      totalPrice,
      specialRequests: input.specialRequests,
      status: 'PENDING',
      paymentStatus: 'PENDING'
    }
  });

  await prisma.log.create({
    data: {
      userId: session.userId,
      reservationId: reservation.id,
      action: 'RESERVATION_CREATED',
      details: { reservationId: reservation.id, roomId: input.roomId, totalPrice }
    }
  });

  return {
    id: reservation.id,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    totalPrice: reservation.totalPrice,
    status: reservation.status
  };
}
