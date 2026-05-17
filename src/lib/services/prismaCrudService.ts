import { createJsonStorage, BaseRecord } from '../storage/json-storage';

export interface CrudService<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string | number): Promise<T | undefined>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string | number, updates: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  search(filter: Partial<T>): Promise<T[]>;
}

function getJsonFilename(tableName: string): string {
  const tableMap: Record<string, string> = {
    'Task': 'tasks.json',
    'User': 'users.json',
    'Room': 'rooms.json',
    'Reservation': 'reservations.json',
    'Payment': 'payments.json',
    'Log': 'logs.json',
    'HotelSettings': 'hotelSettings.json',
    'Media': 'media.json',
    'ContactMessage': 'contactMessages.json',
    'Staff': 'staff.json',
    'HousekeepingTask': 'housekeepingTasks.json',
    'InventoryItem': 'inventoryItems.json',
    'SeasonalRate': 'seasonalRates.json',
  };
  return tableMap[tableName] || `${tableName.toLowerCase()}s.json`;
}

export function createPrismaCrudService<T extends { id: string }>(
  tableName: string
): CrudService<T> {
  const filename = getJsonFilename(tableName);
  const storage = createJsonStorage<T>(filename, []);

  return {
    async getAll() {
      return storage.getAll();
    },

    async getById(id) {
      return storage.findById(String(id));
    },

    async create(item) {
      return storage.create(item as any);
    },

    async update(id, updates) {
      const updated = storage.update(String(id), updates as any);
      if (!updated) throw new Error('Not found');
      return updated;
    },

    async delete(id) {
      return storage.delete(String(id));
    },

    async search(filter) {
      return storage.findMany(filter as any);
    },
  };
}
