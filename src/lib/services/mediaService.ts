import { createPrismaCrudService } from './prismaCrudService';

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mediaService = createPrismaCrudService<MediaItem>('Media');
