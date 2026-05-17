import { createPrismaCrudService } from './prismaCrudService';

export type ContactMessage = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
};

export const contactService = createPrismaCrudService<ContactMessage>('ContactMessage');

