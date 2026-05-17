import { storage } from '@/lib/storage';

export const uploadService = {
  async uploadImage(file: File): Promise<string> {
    return storage.upload(file, '');
  },

  async uploadFile(file: File): Promise<string> {
    return storage.upload(file, 'files');
  }
};
