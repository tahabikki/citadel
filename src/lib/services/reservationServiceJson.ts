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

const staticReservations: Reservation[] = [];

export const reservationServiceJson = {
  async getAll(): Promise<Reservation[]> {
    return staticReservations;
  },

  async getById(id: string): Promise<Reservation | undefined> {
    return staticReservations.find(r => r.id === id);
  },

  async create(item: Partial<Reservation>): Promise<Reservation> {
    const reservation: Reservation = {
      id: "demo-" + Date.now(),
      roomId: item.roomId || "",
      guestName: item.guestName || "Demo Guest",
      guestEmail: item.guestEmail || "",
      guestPhone: item.guestPhone || "",
      checkIn: item.checkIn || new Date().toISOString(),
      checkOut: item.checkOut || new Date().toISOString(),
      guests: item.guests || 1,
      adults: item.adults || 1,
      children: item.children || 0,
      totalPrice: item.totalPrice || 0,
      status: "PENDING",
      paymentStatus: "PENDING",
      specialRequests: item.specialRequests || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return reservation;
  },

  async update(_id: string, updates: Partial<Reservation>): Promise<Reservation> {
    return { ...updates } as Reservation;
  },

  async delete(_id: string): Promise<boolean> {
    return true;
  },

  async search(_filter: Partial<Reservation>): Promise<Reservation[]> {
    return staticReservations;
  },
};