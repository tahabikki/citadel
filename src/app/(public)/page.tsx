import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { BookingSection } from "@/components/BookingSection";
import { RoomsSection } from "@/components/RoomsSection";
import { AboutSection } from "@/components/AboutSection";
import { OffersSection } from "@/components/OffersSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import CitadelDetailsStatic from "@/components/CitadelDetailsStatic";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Citadel Hôtel | Luxury Hotel in Calais, France",
  description: "Experience luxury at Citadel Hôtel in Calais. Elegant rooms, fine dining, and exceptional service.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ScrollReveal animation="fade-right">
          <BookingSection />
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={80}>
          <AboutSection />
        </ScrollReveal>
        <ScrollReveal animation="fade-right" delay={120}>
          <RoomsSection />
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={160}>
          <OffersSection />
        </ScrollReveal>
        <ScrollReveal animation="fade-right" delay={200}>
          <TestimonialsSection />
        </ScrollReveal>
        <ScrollReveal animation="fade-left" delay={240}>
          <CitadelDetailsStatic />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
