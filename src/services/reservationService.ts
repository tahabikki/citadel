import { apiClient } from './apiClient';

export type ReservationCreateInput = {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults?: number;
  children?: number;
  specialRequests?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
};

export type ReservationUpdateAction = 'check-in' | 'check-out' | 'cancel';

export const reservationService = {
  create(input: ReservationCreateInput) {
    return apiClient.post<{ reservation: { id: string } }>('/reservations', input);
  },
  getByUser() {
    return apiClient.get<{ reservations: unknown[] }>('/reservations');
  },
  updateStatus(reservationId: string, action: ReservationUpdateAction) {
    return apiClient.patch('/reservations', { reservationId, action });
  }
};
