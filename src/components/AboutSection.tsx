'use client';

import Image from 'next/image';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { images } from '@/lib/images';

export function AboutSection() {
  return (
    <section id="about" className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">The Hotel</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6">Citadel Hôtel</h2>
            <p className="text-lg text-[var(--secondary)] mb-8 leading-relaxed">
              Set next to the ferry terminal in Calais, this elegant hotel is just 400 meters from the train station. 
              It offers free Wi-Fi access throughout and all the rooms have a LCD TV. The rooms at Citadel Hôtel are 
              decorated in neutral tones. Each one also provides a private bathroom with a shower and free toiletries.
            </p>
            <p className="text-lg text-[var(--secondary)] mb-8 leading-relaxed">
              A buffet breakfast is served every morning in the property's dining area. After breakfast, you may 
              choose to walk the 300 meters to the center of Calais or visit the beach, just 800 meters from the hotel.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
                <span>28 rue Royale, 62100 Calais, France</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--primary)]" />
                <span>+33 3 21 97 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
                <span>contact@citadelhotel.fr</span>
              </div>
            </div>

            <button className="btn-primary inline-flex items-center gap-2 group">
              Learn More
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Images */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
               <div className="relative h-[280px] rounded-lg overflow-hidden">
                 <Image
                   src={images[0]}
                   alt="Hotel Exterior"
                   fill
                   className="object-cover"
                   sizes="100vw"
                 />
               </div>
               <div className="relative h-[200px] rounded-lg overflow-hidden">
                 <Image
                   src={images[6]}
                   alt="Restaurant"
                   fill
                   className="object-cover"
                   sizes="100vw"
                 />
               </div>
            </div>
            <div className="space-y-4 pt-8">
               <div className="relative h-[200px] rounded-lg overflow-hidden">
                 <Image
                   src={images[4]}
                   alt="Room"
                   fill
                   className="object-cover"
                   sizes="100vw"
                 />
               </div>
               <div className="relative h-[280px] rounded-lg overflow-hidden">
                 <Image
                   src={images[7]}
                   alt="Lobby"
                   fill
                   className="object-cover"
                   sizes="100vw"
                 />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}