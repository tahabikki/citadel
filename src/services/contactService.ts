import { apiClient } from './apiClient';

export type ContactMessageInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export const contactService = {
  sendMessage(input: ContactMessageInput) {
    return apiClient.post('/contact', input);
  }
};
