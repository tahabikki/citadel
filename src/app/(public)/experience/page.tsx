import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import Image from "next/image";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Experience | Citadel Hôtel",
  description: "Discover the unique experiences at Citadel Hôtel in Calais.",
};

const experiences = [
  {
    id: 1,
    title: "Spa & Wellness",
    description: "Relax and rejuvenate at our wellness center with massage therapies and treatments.",
    image: 15
  },
  {
    id: 2,
    title: "Beach Access",
    description: "Just minutes from the beautiful beaches of Calais.",
    image: 7
  },
  {
    id: 3,
    title: "City Exploration",
    description: "Discover the rich history and culture of Calais nearby.",
    image: 4
  }
];

export default function ExperiencePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom text-center">
            <ScrollReveal animation="fade-right">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Experience</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={90}>
              <h1 className="font-display text-4xl md:text-5xl mb-6">Unique Experiences</h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={160}>
              <p className="text-[var(--secondary)] max-w-2xl mx-auto">
                Discover extraordinary moments during your stay at Citadel Hôtel.
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experiences.map((exp, idx) => (
                <ScrollReveal
                  key={exp.id}
                  animation={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
                  delay={idx * 90}
                  className="h-full"
                >
                  <div className="h-full bg-[var(--card)] rounded-lg overflow-hidden border border-[var(--border-light)] group">
                    <div className="relative h-48">
                      <Image
                        src={images[exp.image]}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="font-display text-xl mb-2">{exp.title}</h2>
                      <p className="text-[var(--secondary)] text-sm">{exp.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
