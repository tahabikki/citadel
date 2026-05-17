import { roomService } from './roomService';
import { reservationService } from './reservationService';

type RoomFilters = {
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: string | null;
  roomType?: string | null;
};

export async function listAvailableRooms(filters: RoomFilters) {
  const rooms = await roomService.getAll();
  
  let filtered = rooms.filter(r => r.available);
  
  if (filters.roomType) {
    filtered = filtered.filter(r => r.type === filters.roomType?.toUpperCase());
  }
  
  if (filters.guests) {
    filtered = filtered.filter(r => r.maxGuests >= parseInt(filters.guests!, 10));
  }

  return filtered.sort((a, b) => a.price - b.price);
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

  const room = await roomService.getById(input.roomId);
  
  if (!room || !room.available) {
    throw new Error('Room not available');
  }

  if (input.guests > room.maxGuests) {
    throw new Error(`Maximum ${room.maxGuests} guests allowed`);
  }

  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = room.price * nights;

  const reservation = await reservationService.create({
    userId: session.userId,
    roomId: input.roomId,
    guestName: `${session.firstName || 'Guest'} ${session.lastName || ''}`.trim(),
    guestEmail: session.email,
    guestPhone: '',
    checkIn: checkInDate.toISOString(),
    checkOut: checkOutDate.toISOString(),
    guests: input.guests,
    adults: input.adults || 2,
    children: input.children || 0,
    totalPrice,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    specialRequests: input.specialRequests
  });

  return {
    id: reservation.id,
    checkIn: reservation.checkIn,
    checkOut: reservation.checkOut,
    totalPrice: reservation.totalPrice,
    status: reservation.status
  };
}