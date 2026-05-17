import type { Metadata } from 'next';
import { Suspense } from 'react';
import RoomsClient from './RoomsClient';

export const metadata: Metadata = {
  title: 'Rooms | Citadel Hôtel',
  description: 'View all available rooms at Citadel Hôtel in Calais. Book your perfect stay.',
};

export default function RoomsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-xl">Loading rooms...</div></div>}>
      <RoomsClient />
    </Suspense>
  );
}

