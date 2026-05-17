import { createJsonStorage } from '../storage/json-storage';

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  beds: string;
  description: string;
  amenities: string[];
  floor?: number;
  images: string[];
  status: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

const roomStorage = createJsonStorage<Room>('rooms.json', []);

export const roomServiceJson = {
  async getAll(): Promise<Room[]> {
    return roomStorage.getAll();
  },

  async getById(id: string): Promise<Room | undefined> {
    return roomStorage.findById(id);
  },

  async create(item: Partial<Room>): Promise<Room> {
    return roomStorage.create({
      roomNumber: item.roomNumber || `ROOM-${Date.now()}`,
      name: item.name || 'New Room',
      type: item.type || 'DOUBLE',
      price: item.price || 0,
      maxGuests: item.maxGuests || 2,
      beds: item.beds || '1 bed',
      description: item.description || '',
      amenities: item.amenities || [],
      floor: item.floor,
      images: item.images || [],
      status: item.status || 'AVAILABLE',
      available: item.available !== undefined ? item.available : true,
    });
  },

  async update(id: string, updates: Partial<Room>): Promise<Room> {
    const updated = roomStorage.update(id, updates);
    if (!updated) throw new Error('Room not found');
    return updated;
  },

  async delete(id: string): Promise<boolean> {
    return roomStorage.delete(id);
  },

  async search(filter: Partial<Room>): Promise<Room[]> {
    return roomStorage.findMany(filter as any);
  },
};