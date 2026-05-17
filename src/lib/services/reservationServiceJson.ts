import { createJsonStorage } from '../storage/json-storage';

export interface Reservation {
  id: string;
  userId?: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

const reservationStorage = createJsonStorage<Reservation>('reservations.json', []);

export const reservationServiceJson = {
  async getAll(): Promise<Reservation[]> {
    return reservationStorage.getAll();
  },

  async getById(id: string): Promise<Reservation | undefined> {
    return reservationStorage.findById(id);
  },

  async create(item: Partial<Reservation>): Promise<Reservation> {
    return reservationStorage.create({
      userId: item.userId,
      roomId: item.roomId || '',
      guestName: item.guestName || 'Guest',
      guestEmail: item.guestEmail || '',
      guestPhone: item.guestPhone || '',
      checkIn: item.checkIn || new Date().toISOString(),
      checkOut: item.checkOut || new Date().toISOString(),
      guests: item.guests || 1,
      adults: item.adults || 1,
      children: item.children || 0,
      totalPrice: item.totalPrice || 0,
      status: item.status || 'PENDING',
      paymentStatus: item.paymentStatus || 'PENDING',
      specialRequests: item.specialRequests || '',
    });
  },

  async update(id: string, updates: Partial<Reservation>): Promise<Reservation> {
    const updated = reservationStorage.update(id, updates);
    if (!updated) throw new Error('Reservation not found');
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    return reservationStorage.delete(id);
  },

  async search(filter: Partial<Reservation>): Promise<Reservation[]> {
    return reservationStorage.findMany(filter as any);
  },
};