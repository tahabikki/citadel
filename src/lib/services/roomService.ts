import { roomServiceJson, Room } from './roomServiceJson';

export type { Room };

export const roomService = {
  async getAll(): Promise<Room[]> {
    return roomServiceJson.getAll();
  },

  async getById(id: string | number): Promise<Room | undefined> {
    return roomServiceJson.getById(String(id));
  },

  async create(item: Omit<Room, 'id'>): Promise<Room> {
    return roomServiceJson.create(item as any);
  },

  async update(id: string | number, updates: Partial<Room>): Promise<Room> {
    return roomServiceJson.update(String(id), updates as any);
  },

  async delete(id: string | number): Promise<boolean> {
    return roomServiceJson.delete(String(id));
  },

  async search(filter: Partial<Room>): Promise<Room[]> {
    return roomServiceJson.search(filter as any);
  },
};
