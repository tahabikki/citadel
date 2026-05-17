import { paymentService } from './paymentService';
import { reservationService } from './reservationService';

export async function createPaymentForReservation(input: { reservationId: string; userId: string }) {
  const reservation = await reservationService.getById(input.reservationId);

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  if (reservation.userId && reservation.userId !== input.userId) {
    throw new Error('Unauthorized');
  }

  if (reservation.paymentStatus === 'PAID') {
    throw new Error('Payment already completed');
  }

  const now = new Date().toISOString();
  const providerPaymentId = `pi_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const payment = await paymentService.create({
    reservationId: reservation.id,
    amount: Number(reservation.totalPrice || 0),
    currency: 'EUR',
    status: 'PENDING',
    provider: 'STRIPE',
    providerPaymentId,
    createdAt: now,
    updatedAt: now,
  });

  await reservationService.update(reservation.id, {
    paymentStatus: 'PENDING',
    updatedAt: now,
  });

  return {
    clientSecret: `test_client_secret_${providerPaymentId}`,
    paymentId: payment.id
  };
}

export async function completePayment(input: { paymentIntentId: string; status: string }) {
  const payments = await paymentService.getAll();
  const payment = payments.find((p) => p.providerPaymentId === input.paymentIntentId);

  if (!payment) {
    throw new Error('Payment not found');
  }

  const paymentStatus = input.status === 'succeeded' ? 'PAID' : 'FAILED';

  const now = new Date().toISOString();
  await paymentService.update(payment.id, { status: paymentStatus, updatedAt: now });

  if (paymentStatus === 'PAID') {
    const reservation = await reservationService.getById(payment.reservationId);
    if (reservation) {
      await reservationService.update(payment.reservationId, {
        paymentStatus: 'PAID',
        status: reservation.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED',
        updatedAt: now,
      });
    }
  }

  return { success: true };
}
