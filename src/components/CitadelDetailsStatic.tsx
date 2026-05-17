'use client';

import Image from 'next/image';
import {
  Wifi,
  Ban,
  Users,
  Clock,
  PawPrint,
  MapPin,
  Landmark,
  Navigation,
  LibraryBig,
  MessageCircleQuestion,
} from 'lucide-react';
import { mediaUrl } from '@/lib/images';

type FAQItem = { q: string; a: string };

const photos = [
  { src: mediaUrl('image_007.jpg'), alt: 'Citadel Hôtel photo 1' },
  { src: mediaUrl('image_011.jpg'), alt: 'Citadel Hôtel photo 2' },
  { src: mediaUrl('image_032.jpg'), alt: 'Citadel Hôtel photo 3' },
  { src: mediaUrl('image_084.jpg'), alt: 'Citadel Hôtel photo 4' },
];

const facilities = [
  { icon: Ban, label: 'Non-smoking rooms' },
  { icon: Wifi, label: 'Free Wi‑Fi' },
  { icon: Users, label: 'Family rooms' },
  { icon: Clock, label: '24-hour front desk' },
  { icon: PawPrint, label: 'Pet friendly' },
];

const nearby = [
  { icon: Landmark, name: 'Eglise Notre‑Dame', distance: '250 m' },
  { icon: MapPin, name: 'Citadelle', distance: '350 m' },
  { icon: Navigation, name: 'Phare du Port de Calais', distance: '700 m' },
  { icon: LibraryBig, name: 'Second World War Museum', distance: '750 m' },
];

const faqs: FAQItem[] = [
  {
    q: 'Could I check in at approximately 3:00am if my ferry arrives very early on Sunday morning?',
    a: 'Yes — check-in is possible outside standard hours by prior arrangement.',
  },
  {
    q: 'I would arrive after midnight. Is it possible to check in at around 1:30am?',
    a: 'Yes — late check-in can be accommodated with prior notice.',
  },
  {
    q: 'We would have a late check-in (12:30–1:00). Is this possible?',
    a: 'Yes — late check-in is possible with advance notice.',
  },
  {
    q: 'I have two French bulldogs. Can they stay with me?',
    a: 'Pets are allowed. Please confirm at booking.',
  },
];

export default function CitadelDetailsStatic() {
  return (
    <section className="section-padding bg-[var(--card)]" aria-label="Citadel Hôtel details">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-2">Citadel Hôtel Details</p>
          <h2 className="font-display text-3xl md:text-4xl">A refined stay in Calais</h2>
          <p className="text-[var(--secondary)] max-w-3xl mx-auto mt-3">
            Set next to the ferry terminal in Calais, Citadel Hôtel is a 2‑star property offering free Wi‑Fi and LCD TVs
            in all rooms. The center of Calais is a short walk away and the beach is nearby.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-7 relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--background)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 z-10" />
                <Image
                  src={photos[0].src}
                  alt={photos[0].alt}
                  width={1200}
                  height={900}
                  className="h-72 md:h-[26rem] w-full object-cover"
                  priority
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                    <MapPin className="w-3.5 h-3.5" />
                    Steps from the ferry terminal
                  </span>
                </div>
              </div>

              <div className="col-span-12 md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4">
                {photos.slice(1).map((p) => (
                  <div
                    key={p.src}
                    className="relative overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--background)]"
                  >
                    <Image src={p.src} alt={p.alt} width={900} height={700} className="h-36 md:h-[8.5rem] w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-6 md:p-7">
              <h3 className="font-display text-xl md:text-2xl mb-1">Facilities</h3>
              <p className="text-sm text-[var(--secondary)] mb-6">Practical comfort, thoughtfully presented.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {facilities.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border-light)] bg-[var(--card)] p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div className="font-medium">{f.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl border border-[var(--border-light)] bg-[var(--card)] p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c9a86c]/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#c9a86c]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1">Nearby attractions</h4>
                    <ul className="space-y-2 text-sm text-[var(--secondary)]">
                      {nearby.map((n) => (
                        <li key={n.name} className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-2 min-w-0">
                            <n.icon className="w-4 h-4 text-[var(--secondary)]" />
                            <span className="truncate">{n.name}</span>
                          </span>
                          <span className="shrink-0 rounded-full bg-[var(--background)] px-2.5 py-1 text-xs text-[var(--foreground)]/70 border border-[var(--border-light)]">
                            {n.distance}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)]">FAQ</p>
              <h3 className="font-display text-2xl md:text-3xl">Quick answers</h3>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[var(--secondary)]">
              <MessageCircleQuestion className="w-4 h-4" />
              Late check-in & pets
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-[var(--border-light)] bg-[var(--background)] p-5 open:bg-[var(--card)] transition-colors"
              >
                <summary className="cursor-pointer list-none">
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-semibold leading-snug">{f.q}</div>
                    <div className="shrink-0 w-9 h-9 rounded-full border border-[var(--border-light)] bg-[var(--background)] flex items-center justify-center group-open:bg-[var(--primary)] group-open:text-white group-open:border-[var(--primary)] transition-colors">
                      <span className="text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                    </div>
                  </div>
                </summary>
                <div className="pt-3 text-sm text-[var(--secondary)] leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

