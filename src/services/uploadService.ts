import { apiClient } from './apiClient';

export const uploadService = {
  upload(formData: FormData) {
    return fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then(async (response) => {
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Upload failed');
      }

      return response.json();
    });
  },
  uploadMedia(kind: 'image' | 'file', file: File) {
    const formData = new FormData();
    formData.append('kind', kind);
    formData.append('file', file);
    return this.upload(formData);
  },
  getMedia() {
    return apiClient.get('/media');
  }
};
