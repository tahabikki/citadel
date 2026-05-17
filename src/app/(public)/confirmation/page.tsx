'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservationId');

  if (!reservationId) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Reservation Confirmed!
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Thank you for choosing Citadel Hotel. Your reservation has been successfully created.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reservation Details
              </h2>

              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reservation ID:</span>
                  <span className="font-mono font-semibold">{reservationId}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending Confirmation
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                You will receive a confirmation email shortly with all the details.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/rooms"
                  className="btn-primary"
                >
                  View Rooms
                </a>

                <a
                  href="/"
                  className="btn-secondary"
                >
                  Return Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}