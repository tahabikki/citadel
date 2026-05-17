import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OffersSection } from "@/components/OffersSection";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Offers | Citadel Hôtel",
  description: "Special offers and packages at Citadel Hôtel in Calais.",
};

export default function OffersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom text-center">
            <ScrollReveal animation="fade-right">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Special Offers</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={90}>
              <h1 className="font-display text-4xl md:text-5xl mb-6">Exclusive Offers</h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={160}>
              <p className="text-[var(--secondary)] max-w-2xl mx-auto">
                Discover our special packages and exclusive deals for your stay at Citadel Hôtel.
              </p>
            </ScrollReveal>
          </div>
        </section>
        <ScrollReveal animation="fade-up" delay={120}>
          <OffersSection />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
