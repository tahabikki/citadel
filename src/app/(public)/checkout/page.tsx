'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { reservationService } from '@/services/reservationService';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const checkIn = searchParams.get('checkIn') || '2026-04-30';
  const checkOut = searchParams.get('checkOut') || '2026-05-15';
  const guests = parseInt(searchParams.get('guests') || '2');
  const roomId = searchParams.get('roomId') || '2';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total price (mock: 150 per night for room 2)
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = 150 * nights; // Mock price for Standard Double

  const reservationData = {
    roomId,
    checkIn,
    checkOut,
    guests,
    adults: guests,
    children: 0,
    totalPrice
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In real app, confirm the draft with user info
      const fullReservationData = {
        ...reservationData,
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        specialRequests: formData.specialRequests
      };

      const response = await reservationService.create(fullReservationData);

      if (response.reservation) {
        router.push(`/confirmation?reservationId=${response.reservation.id}`);
      } else {
        throw new Error('Failed to confirm reservation');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Reservation Summary */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Reservation Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Room:</span>
                  <span className="font-semibold">{roomId === '1' ? 'Deluxe Suite' : 'Standard Double'}</span>
                </div>

                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{new Date(checkIn).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{new Date(checkOut).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{nights}</span>
                </div>

                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests} adults</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>€{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Guest Information</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                  <textarea
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requests or notes..."
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Confirm Reservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
      <CheckoutForm />
    </Suspense>
  );
}