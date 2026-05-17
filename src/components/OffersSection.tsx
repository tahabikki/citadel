'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { images } from '@/lib/images';

const offers = [
  {
    id: 1,
    title: 'Spring Escape',
    category: 'Rooms & Suites',
    description: 'Enjoy an indulgent stay enhanced with Peninsula Time, daily breakfast for two and a USD 100 dining and spa credit.',
    image: images[15],
    cta: 'Explore More'
  },
  {
    id: 2,
    title: 'Complimentary Third Night',
    category: 'Rooms & Suites',
    description: 'Enjoy a complimentary third night when booking a minimum stay of three consecutive nights.',
    image: images[20],
    cta: 'Explore More'
  },
  {
    id: 3,
    title: 'Luxury in Advance',
    category: 'Rooms & Suites',
    description: 'Reserve a stay at any of our superbly luxurious properties prior to your arrival, and enjoy preferential rates.',
    image: images[25],
    cta: 'Explore More'
  },
  {
    id: 4,
    title: 'Sakura Afternoon Tea',
    category: 'Dining',
    description: 'Enjoy a delightful cherry-blossom themed Afternoon Tea at The Lobby.',
    image: images[30],
    cta: 'Explore More'
  }
];

const filters = [
  { id: 'ALL', label: 'All' },
  { id: 'Rooms & Suites', label: 'Rooms & Suites' },
  { id: 'Dining', label: 'Dining' }
];

export function OffersSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredOffers = useMemo(() => {
    if (activeFilter === 'ALL') return offers;
    return offers.filter(offer => offer.category === activeFilter);
  }, [activeFilter]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <section className="section-padding bg-[var(--card)]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-2">Special Offers</p>
          <h2 className="font-display text-3xl md:text-4xl">Featured Offers</h2>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="group">
              <div className="relative h-[220px] overflow-hidden rounded-lg mb-4">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 text-xs uppercase tracking-wider">
                    {offer.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl">{offer.title}</h3>
                <p className="text-[var(--secondary)] text-sm">{offer.description}</p>
                <Link href="/offers" className="btn-primary mt-2 text-sm inline-block">
                  {offer.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}