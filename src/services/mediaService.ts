import { apiClient } from './apiClient';

export type MediaItem = {
  id: string;
  url: string;
  filename: string;
  type: string;
  isActive: boolean;
};

export const mediaService = {
  list() {
    return apiClient.get<{ media: MediaItem[] }>('/media');
  },
  update(id: string, updates: unknown) {
    return apiClient.put(`/media/${id}`, updates);
  },
  create(input: { url: string; filename: string; type: string }) {
    return apiClient.post('/media', input);
  },
  remove(id: string) {
    return apiClient.del(`/media/${id}`);
  }
};
