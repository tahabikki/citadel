export interface CrudService<T extends { id: string }> {
  getAll(): Promise<T[]>;
  getById(id: string | number): Promise<T | undefined>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string | number, updates: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  search(filter: Partial<T>): Promise<T[]>;
}

const staticData: Record<string, any[]> = {
  Staff: [
    {
      id: "c1",
      name: "Marie Dubois",
      email: "marie.dubois@citadel.com",
      phone: "+33 6 12 34 56 78",
      role: "Manager",
      department: "Administration",
      status: "ACTIVE",
      hireDate: "2023-01-15",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    },
    {
      id: "c2",
      name: "Jean-Pierre Martin",
      email: "jean.martin@citadel.com",
      phone: "+33 6 23 45 67 89",
      role: "Receptionist",
      department: "Front Desk",
      status: "ACTIVE",
      hireDate: "2023-06-01",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z"
    }
  ],
  InventoryItem: [
    { id: "c1", name: "Towels", category: "Linens", quantity: 100, unit: "pieces", minStock: 20, location: "Storage Room A", status: "OK", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" },
    { id: "c2", name: "Shampoo", category: "Toiletries", quantity: 50, unit: "bottles", minStock: 10, location: "Storage Room B", status: "OK", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2024-01-01T00:00:00.000Z" }
  ],
  Media: [],
  ContactMessage: [],
  HousekeepingTask: [],
  Task: [],
  Log: [],
  SeasonalRate: [],
  User: [],
  Payment: [],
};

export function createPrismaCrudService<T extends { id: string }>(
  tableName: string
): CrudService<T> {
  const data = staticData[tableName] || [];

  return {
    async getAll() {
      return data as T[];
    },

    async getById(id) {
      return data.find((item: any) => item.id === String(id)) as T | undefined;
    },

    async create(item) {
      const newItem = { ...item, id: "c" + Date.now() } as T;
      return newItem;
    },

    async update(id, updates) {
      const existing = data.find((item: any) => item.id === String(id));
      if (!existing) throw new Error('Not found');
      return { ...existing, ...updates } as T;
    },

    async delete(id) {
      return true;
    },

    async search(filter) {
      return data.filter((item: any) =>
        Object.entries(filter).every(([key, value]) => item[key] === value)
      ) as T[];
    },
  };
}