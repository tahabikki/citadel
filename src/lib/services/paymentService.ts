import { createPrismaCrudService } from './prismaCrudService';

export type Payment = {
  id: string;
  reservationId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
  provider?: 'STRIPE' | 'MANUAL';
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
};

export const paymentService = createPrismaCrudService<Payment>('Payment');

