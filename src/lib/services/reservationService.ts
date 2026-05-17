import { reservationServiceJson, Reservation } from './reservationServiceJson';

export type { Reservation };

export const reservationService = {
  async getAll(): Promise<Reservation[]> {
    return reservationServiceJson.getAll();
  },

  async getById(id: string | number): Promise<Reservation | undefined> {
    return reservationServiceJson.getById(String(id));
  },

  async create(item: Partial<Reservation>): Promise<Reservation> {
    return reservationServiceJson.create(item);
  },

  async update(id: string | number, updates: Partial<Reservation>): Promise<Reservation> {
    return reservationServiceJson.update(String(id), updates);
  },

  async delete(id: string | number): Promise<boolean> {
    return reservationServiceJson.delete(String(id));
  },

  async search(filter: Partial<Reservation>): Promise<Reservation[]> {
    return reservationServiceJson.search(filter);
  },
};
