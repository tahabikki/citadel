import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { completePayment, createPaymentForReservation } from '@/lib/services/paymentsApiService';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Please login to complete payment' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reservationId, paymentMethodId } = body;
    void paymentMethodId;

    if (!reservationId) {
      return NextResponse.json(
        { error: 'Missing reservationId' },
        { status: 400 }
      );
    }

    const payment = await createPaymentForReservation({ reservationId, userId: session.userId });

    return NextResponse.json({
      clientSecret: payment.clientSecret,
      paymentId: payment.paymentId
    });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment failed' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, status } = body;

    if (!paymentIntentId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await completePayment({ paymentIntentId, status });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Payment webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}