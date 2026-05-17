import { createPrismaCrudService } from './prismaCrudService';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'CLEANING' | 'TOILETRIES' | 'LINEN' | 'AMENITIES' | 'FOOD_BEVERAGE';
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  createdAt: string;
  updatedAt: string;
}

export const inventoryService = createPrismaCrudService<InventoryItem>('InventoryItem');
