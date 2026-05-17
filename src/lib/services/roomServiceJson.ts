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

const staticRooms: Room[] = [
  {
    id: "c1",
    roomNumber: "101",
    name: "Classic Single",
    type: "SINGLE",
    price: 89,
    maxGuests: 1,
    beds: "1 single bed",
    description: "Elegant single room with modern amenities, ideal for solo travelers.",
    amenities: ["WiFi", "TV", "Private Bathroom", "Heating"],
    floor: 1,
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "c2",
    roomNumber: "102",
    name: "Superior Double",
    type: "DOUBLE",
    price: 129,
    maxGuests: 2,
    beds: "1 double bed",
    description: "Spacious double room with refined comfort and practical amenities.",
    amenities: ["WiFi", "TV", "Mini Bar", "Work Desk"],
    floor: 1,
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "c3",
    roomNumber: "103",
    name: "Deluxe Twin",
    type: "TWIN",
    price: 149,
    maxGuests: 2,
    beds: "2 twin beds",
    description: "Modern twin room designed for friends or business travelers.",
    amenities: ["WiFi", "TV", "AC", "Private Bathroom"],
    floor: 1,
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "c4",
    roomNumber: "104",
    name: "Family Suite",
    type: "FAMILY",
    price: 199,
    maxGuests: 4,
    beds: "1 double bed and 2 single beds",
    description: "Spacious suite for families with generous bedding and room service.",
    amenities: ["WiFi", "TV", "Mini Bar", "Room Service"],
    floor: 2,
    images: ["https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "c5",
    roomNumber: "105",
    name: "Royal Suite",
    type: "SUITE",
    price: 349,
    maxGuests: 3,
    beds: "1 king bed",
    description: "Premium suite with elevated finishes, balcony, and extra comfort.",
    amenities: ["WiFi", "TV", "Mini Bar", "Room Service", "Balcony"],
    floor: 3,
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "c6",
    roomNumber: "106",
    name: "Executive Double",
    type: "DOUBLE",
    price: 159,
    maxGuests: 2,
    beds: "1 queen bed",
    description: "Sophisticated double room for business and weekend stays.",
    amenities: ["WiFi", "TV", "Mini Bar", "Work Desk"],
    floor: 2,
    images: ["https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop"],
    status: "AVAILABLE",
    available: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];

export const roomServiceJson = {
  async getAll(): Promise<Room[]> {
    return staticRooms;
  },

  async getById(id: string): Promise<Room | undefined> {
    return staticRooms.find(r => r.id === id);
  },

  async create(_item: Partial<Room>): Promise<Room> {
    return staticRooms[0];
  },

  async update(_id: string, _updates: Partial<Room>): Promise<Room> {
    return staticRooms[0];
  },

  async delete(_id: string): Promise<boolean> {
    return true;
  },

  async search(filter: Partial<Room>): Promise<Room[]> {
    return staticRooms.filter(r => 
      Object.entries(filter).every(([key, value]) => (r as any)[key] === value)
    );
  },
};