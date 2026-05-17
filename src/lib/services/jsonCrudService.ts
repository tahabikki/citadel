import { createJsonStorage, BaseRecord } from '../storage/json-storage';

export interface JsonCrudService<T extends BaseRecord> {
  findMany: (filter?: Partial<Record<keyof T, unknown>>) => T[];
  findFirst: (filter: Partial<Record<keyof T, unknown>>) => T | undefined;
  findById: (id: string) => T | undefined;
  create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => T;
  update: (id: string, updates: Partial<T>) => T | null;
  delete: (id: string) => boolean;
  getAll: () => T[];
}

export function createJsonCrudService<T extends BaseRecord>(filename: string, defaultData: T[] = []): JsonCrudService<T> {
  const storage = createJsonStorage<T>(filename, defaultData);

  return {
    findMany: (filter?: Partial<Record<keyof T, unknown>>) => storage.findMany(filter as any),
    findFirst: (filter: Partial<Record<keyof T, unknown>>) => storage.findFirst(filter as any),
    findById: (id: string) => storage.findById(id),
    create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => storage.create(item as any),
    update: (id: string, updates: Partial<T>) => storage.update(id, updates as any),
    delete: (id: string) => storage.delete(id),
    getAll: () => storage.getAll(),
  };
}