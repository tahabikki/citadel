import { createPrismaCrudService } from './prismaCrudService';

export interface HousekeepingTask {
  id: string;
  roomNumber: string;
  type: 'CLEANING' | 'MAINTENANCE' | 'TURNDOWN_SERVICE' | 'LINEN_CHANGE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export const housekeepingService = createPrismaCrudService<HousekeepingTask>('HousekeepingTask');
