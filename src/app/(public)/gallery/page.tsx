'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import Image from "next/image";
import { useState, useEffect } from "react";
import { images } from "@/lib/images";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";

const categories = [
  { id: "all", label: "All" },
  { id: "rooms", label: "Rooms" },
  { id: "dining", label: "Dining" },
  { id: "exterior", label: "Exterior" },
  { id: "amenities", label: "Amenities" }
];

const galleryItems = images.slice(0, 16).map((img, i) => ({
  id: i,
  src: img,
  category: i < 4 ? "rooms" : i < 8 ? "dining" : i < 12 ? "exterior" : "amenities"
}));

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[var(--card)]">
          <div className="container-custom text-center">
            <ScrollReveal animation="fade-right">
              <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-4">Gallery</p>
            </ScrollReveal>
            <ScrollReveal animation="fade-left" delay={90}>
              <h1 className="font-display text-4xl md:text-5xl mb-6">Our Visual Story</h1>
            </ScrollReveal>
            <ScrollReveal animation="fade-right" delay={160}>
              <p className="text-[var(--secondary)] max-w-2xl mx-auto">
                Explore the elegance of Citadel Hôtel through our collection of beautiful images.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-8 sticky top-16 bg-[var(--background)] z-10 border-b border-[var(--border-light)]">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 text-sm transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-transparent text-[var(--secondary)] border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <ScrollReveal
                  key={item.id}
                  animation={index % 2 === 0 ? 'fade-right' : 'fade-left'}
                  delay={index * 45}
                  className={index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                >
                  <div
                    className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={item.src}
                      alt={`Gallery ${item.id + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 p-2 text-white z-10 hover:text-[var(--primary)] transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-7 h-7" />
            </button>
            <button 
              className="absolute left-4 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => prev === 0 ? filteredItems.length - 1 : (prev! - 1));
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={filteredItems[selectedImage as number]?.src || images[0]}
                alt="Gallery"
                fill
                className="object-contain"
              />
            </div>
            <button 
              className="absolute right-4 p-2 text-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => prev === filteredItems.length - 1 ? 0 : (prev! + 1));
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
