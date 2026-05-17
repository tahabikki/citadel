import { createPrismaCrudService } from './prismaCrudService';
import type { UserRole } from '@/lib/auth';

export type UserRecord = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export const userService = createPrismaCrudService<UserRecord>('User');

