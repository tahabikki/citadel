import { createPrismaCrudService } from './prismaCrudService';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'HOUSEKEEPING' | 'MAINTENANCE';
  department: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export const staffService = createPrismaCrudService<Staff>('Staff');
