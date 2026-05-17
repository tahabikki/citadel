import { createPrismaCrudService } from './prismaCrudService';

export interface Task {
  id: string;
  type: 'CREATE_CARD' | 'REVOKE_CARD' | 'UPDATE_CARD';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  roomNumber: string;
  reservationId: string;
  createdAt: string;
  completedAt?: string;
}

export const taskService = createPrismaCrudService<Task>('Task');
