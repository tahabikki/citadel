import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'storage', 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readFile<T>(filename: string, defaultData: T[]): T[] {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return defaultData;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return defaultData;
  }
}

function writeFile<T>(filename: string, data: T[]): void {
  ensureDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export interface BaseRecord {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

function generateId(): string {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

export function createJsonStorage<T extends BaseRecord>(filename: string, defaultData: T[] = []) {
  let data = readFile(filename, defaultData);

  const save = () => writeFile(filename, data);

  return {
    findMany: (filter?: Partial<Record<keyof T, unknown>>) => {
      if (!filter) return [...data];
      return data.filter(item =>
        Object.entries(filter).every(([key, value]) => item[key as keyof T] === value)
      );
    },

    findFirst: (filter: Partial<Record<keyof T, unknown>>) => {
      return data.find(item =>
        Object.entries(filter).every(([key, value]) => item[key as keyof T] === value)
      );
    },

    findById: (id: string) => {
      return data.find(item => item.id === id);
    },

    create: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T => {
      const now = new Date().toISOString();
      const newItem = {
        ...item,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      } as T;
      data.push(newItem);
      save();
      return newItem;
    },

    update: (id: string, updates: Partial<T>): T | null => {
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      data[index] = {
        ...data[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      save();
      return data[index];
    },

    delete: (id: string): boolean => {
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return false;
      data.splice(index, 1);
      save();
      return true;
    },

    getAll: () => [...data],
  };
}