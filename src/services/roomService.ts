import { apiClient } from './apiClient';

export type RoomFilters = {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  type?: string;
};

export const roomService = {
  getAll(filters: RoomFilters = {}) {
    const queryParams = new URLSearchParams();

    if (filters.checkIn) queryParams.append('checkIn', filters.checkIn);
    if (filters.checkOut) queryParams.append('checkOut', filters.checkOut);
    if (filters.guests) queryParams.append('guests', String(filters.guests));
    if (filters.type) queryParams.append('type', filters.type);

    const query = queryParams.toString();
    return apiClient.get(`/rooms${query ? `?${query}` : ''}`);
  },
  getById(id: string) {
    return apiClient.get(`/rooms/${id}`);
  }
};
