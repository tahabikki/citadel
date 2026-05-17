import { reservationService } from './reservationService';
import { roomService } from './roomService';
import { taskService } from './taskService';
import { userService } from './userService';

export async function listAdminReservations(filters: { status?: string | null; date?: string | null }) {
  let reservations = await reservationService.getAll();

  if (filters.status) {
    reservations = reservations.filter((r) => r.status === filters.status?.toUpperCase());
  }

  if (filters.date) {
    const targetDate = new Date(filters.date);
    reservations = reservations.filter((r) => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return checkIn <= targetDate && checkOut >= targetDate;
    });
  }

  const [rooms, tasks, users] = await Promise.all([
    roomService.getAll(),
    taskService.getAll(),
    userService.getAll()
  ]);

  const roomById = new Map(rooms.map((r) => [String(r.id), r]));
  const tasksByReservation = new Map<string, any[]>();
  for (const t of tasks) {
    const key = String((t as any).reservationId || '');
    if (!key) continue;
    const arr = tasksByReservation.get(key) || [];
    arr.push(t);
    tasksByReservation.set(key, arr);
  }
  const userById = new Map(users.map((u) => [String(u.id), u]));

  return reservations
    .map((r) => ({
      ...r,
      user: r.userId ? userById.get(String(r.userId)) : null,
      room: roomById.get(String(r.roomId)) || null,
      tasks: tasksByReservation.get(String(r.id)) || [],
    }))
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
}

export async function updateAdminReservationAction(input: {
  reservationId: string;
  action: string;
  userId: string;
}) {
  const reservation = await reservationService.getById(input.reservationId);
  const room = reservation ? await roomService.getById(reservation.roomId) : null;

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (!room) {
    throw new Error('Room not found');
  }

  if (input.action === 'check-in') {
    if (reservation.status !== 'CONFIRMED' && reservation.status !== 'PENDING') {
      throw new Error('Only confirmed reservations can be checked in');
    }

    const updated = await reservationService.update(input.reservationId, {
      status: 'CHECKED_IN',
      updatedAt: new Date().toISOString()
    });

    const task = await taskService.create({
      reservationId: input.reservationId,
      type: 'CREATE_CARD',
      status: 'PENDING',
      roomNumber: String((room as any).roomNumber || room.id),
      createdAt: new Date().toISOString()
    } as any);

    return {
      reservation: updated,
      task: { id: task.id, type: task.type }
    };
  }

  if (input.action === 'check-out') {
    if (reservation.status !== 'CHECKED_IN') {
      throw new Error('Only active reservations can be checked out');
    }

    const updated = await reservationService.update(input.reservationId, {
      status: 'CHECKED_OUT',
      updatedAt: new Date().toISOString()
    });

    await taskService.create({
      reservationId: input.reservationId,
      type: 'REVOKE_CARD',
      status: 'PENDING',
      roomNumber: String((room as any).roomNumber || room.id),
      createdAt: new Date().toISOString()
    } as any);

    return { reservation: updated };
  }

  if (input.action === 'cancel') {
    const updated = await reservationService.update(input.reservationId, {
      status: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      updatedAt: new Date().toISOString()
    });

    return { reservation: updated };
  }

  throw new Error('Invalid action');
}
