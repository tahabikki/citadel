'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Star } from 'lucide-react';
import { roomImages } from '@/lib/images';

const allRooms = [
  {
    id: 'family',
    name: 'Family Room',
    type: 'Family',
    category: 'Rooms',
    description: 'Spacious family room with 2 adjacent rooms, perfect for families. Features 2 twin beds and 1 queen bed.',
    price: 180,
    maxGuests: 4,
    beds: '2 twin beds + 1 queen bed',
    image: roomImages.family,
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Safe']
  },
  {
    id: 'twin',
    name: 'Twin Room',
    type: 'Twin',
    category: 'Rooms',
    description: 'Comfortable room with 2 twin beds, ideal for business travelers or friends.',
    price: 89,
    maxGuests: 2,
    beds: '2 twin beds',
    image: roomImages.twin,
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating']
  },
  {
    id: 'double',
    name: 'Double Room',
    type: 'Double',
    category: 'Rooms',
    description: 'Cozy room with a full bed, perfect for couples.',
    price: 79,
    maxGuests: 2,
    beds: '1 full bed',
    image: roomImages.double,
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Work Desk']
  },
  {
    id: 'deluxe-suite',
    name: 'Deluxe Suite',
    type: 'Deluxe',
    category: 'Suites',
    description: 'Luxurious suite with separate living area and premium amenities.',
    price: 250,
    maxGuests: 3,
    beds: '1 king bed + 1 sofa bed',
    image: roomImages.family,
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Mini Bar', 'Balcony']
  },
  {
    id: 'presidential',
    name: 'Presidential Suite',
    type: 'Presidential',
    category: 'Signature Suites',
    description: 'Our finest suite with panoramic views and exclusive amenities.',
    price: 450,
    maxGuests: 4,
    beds: '2 king beds',
    image: roomImages.family,
    amenities: ['Free WiFi', 'TV', 'Private Bathroom', 'Heating', 'Jacuzzi', 'Butler Service']
  }
];

const filters = [
  { id: 'ALL', label: 'All' },
  { id: 'Rooms', label: 'Rooms' },
  { id: 'Suites', label: 'Suites' },
  { id: 'Signature Suites', label: 'Signature Suites' }
];

export function RoomsSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredRooms = useMemo(() => {
    if (activeFilter === 'ALL') return allRooms;
    return allRooms.filter(room => room.category === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-2">Accommodation</p>
          <h2 className="font-display text-3xl md:text-4xl">Elegant Accommodation</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-300 border ${
                activeFilter === f.id 
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                  : 'bg-transparent text-[var(--secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="group">
              <div className="relative h-[240px] overflow-hidden rounded-lg mb-4">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">{room.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[var(--primary)] text-[var(--primary)]" />
                    <span className="text-sm">4.6</span>
                  </div>
                </div>
                <p className="text-sm text-[var(--secondary)]">{room.beds}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-light)]">
                  <div>
                    <span className="text-xl font-display">€{room.price}</span>
                    <span className="text-sm text-[var(--secondary)]"> / night</span>
                  </div>
                  <Link href={`/rooms?room=${room.id}`} className="btn-outline text-sm">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/rooms" className="btn-outline inline-flex items-center gap-2">
            Check Availability
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}