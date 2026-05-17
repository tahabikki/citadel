import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import Image from "next/image";
import { images } from "@/lib/images";
import Link from "next/link";
import { Clock, MapPin, Phone, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Dining | Citadel Hôtel",
  description: "Experience exquisite dining at Citadel Hôtel in Calais.",
};

const diningOptions = [
  {
    id: 1,
    name: "The Grand Restaurant",
    type: "Fine Dining",
    description: "Experience culinary excellence with French-inspired cuisine using the finest local ingredients.",
    image: 6,
    price: "€€€",
    rating: 4.7,
    hours: "7:00 AM - 10:00 AM / 12:00 PM - 2:30 PM / 7:00 PM - 10:00 PM",
    features: ["Michelin-recommended", "Chef's Table", "Wine Cellar"]
  },
  {
    id: 2,
    name: "Le Bar Lounge",
    type: "Bar & Lounge",
    description: "Unwind with crafted cocktails and light bites in our elegant lounge atmosphere.",
    image: 10,
    price: "€€",
    rating: 4.5,
    hours: "5:00 PM - 11:00 PM",
    features: ["Live Music", "Cocktails", "Snacks"]
  },
  {
    id: 3,
    name: "Breakfast Terrace",
    type: "Casual Dining",
    description: "Start your day with a delightful breakfast on our scenic terrace.",
    image: 2,
    price: "€€",
    rating: 4.6,
    hours: "7:00 AM - 10:30 AM",
    features: ["Outdoor Seating", "Buffet", "À la carte"]
  }
];

export default function DiningPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="relative h-[50vh] min-h-[400px]">
          <Image
            src={images[6]}
            alt="Dining"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <ScrollReveal animation="fade-right">
              <p className="text-sm tracking-[0.3em] uppercase mb-4 opacity-90">Dining</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={90}>
              <h1 className="font-display text-4xl md:text-6xl mb-4">Culinary Excellence</h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={160}>
              <p className="text-white/80 max-w-xl">
                Savor exquisite flavors at our award-winning restaurant and elegant bars
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {diningOptions.map((venue, idx) => (
                <ScrollReveal key={venue.id} animation={idx % 2 === 0 ? 'fade-right' : 'fade-left'} delay={idx * 90} className="h-full">
                  <div className="h-full bg-[var(--background)] rounded-lg overflow-hidden border border-[var(--border-light)] group">
                    <div className="relative h-56">
                      <Image
                        src={images[venue.image]}
                        alt={venue.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-xs px-3 py-1 rounded">
                        {venue.type}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display text-xl">{venue.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{venue.rating}</span>
                        </div>
                      </div>
                      <p className="text-[var(--secondary)] text-sm mb-4">{venue.description}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-[var(--secondary)] mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{venue.hours}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {venue.features.map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-[var(--card-hover)] rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <button type="button" className="btn-primary w-full">Reserve a Table</button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal animation="fade-right">
                <div className="relative h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={images[15]}
                    alt="Chef's special"
                    fill
                    className="object-cover"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal animation="fade-left" delay={120}>
                <div>
                  <p className="text-sm tracking-[0.2em] uppercase text-[var(--primary)] mb-4">Chef&apos;s Special</p>
                  <h2 className="font-display text-3xl mb-4">Seasonal Delights</h2>
                  <p className="text-[var(--secondary)] mb-6 leading-relaxed">
                    Our award-winning chef creates seasonal menus inspired by the finest local ingredients from the Calais region. From fresh seafood to organic produce, every dish tells a story of culinary passion.
                  </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                    <span>Fresh locally-sourced ingredients</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                    <span>Extensive wine collection</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full" />
                    <span>Private dining available</span>
                  </li>
                </ul>
                  <Link href="/contact" className="btn-primary">View Menu</Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom text-center">
            <ScrollReveal animation="fade-right">
              <h2 className="font-display text-3xl mb-4">Ready to Dine?</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={120}>
              <p className="text-[var(--secondary)] mb-8 max-w-lg mx-auto">
                Reserve your table today and experience the finest dining in Calais.
              </p>
            </ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button type="button" className="btn-primary">Reserve Online</button>
              <button type="button" className="btn-outline">Call +33 3 21 97 00 00</button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
