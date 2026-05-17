'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { mediaUrl } from '@/lib/images';

const slides = [
  {
    type: 'video',
    video: mediaUrl('video_01.mp4'),
    title: "Welcome to Citadel Hôtel",
    subtitle: "Experience luxury like never before",
    description: "Discover our elegant rooms, world-class dining, and exceptional service in the heart of Calais.",
    ctaText: "Book Your Stay",
    ctaLink: "/rooms"
  },
  {
    type: 'image',
    image: mediaUrl('image_001.jpg'),
    title: "Citadel Hôtel",
    subtitle: "Where Elegance Meets Serenity"
  },
  {
    type: 'image',
    image: mediaUrl('image_064.jpg'),
    title: "A Royal Experience",
    subtitle: "Uncompromising Luxury"
  },
  {
    type: 'image',
    image: mediaUrl('image_075.jpg'),
    title: "Your Sanctuary",
    subtitle: "Refined Comfort Awaits"
  },
  {
    type: 'image',
    image: mediaUrl('image_082.jpg'),
    title: "Timeless Moments",
    subtitle: "Create Lasting Memories"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const slideDuration = 8000;
    
    const timer = setInterval(() => {
      if (!isHovering) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, slideDuration);
    return () => clearInterval(timer);
  }, [isHovering]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  return (
    <section className="relative h-screen min-h-[800px] overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              src={slide.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <Image
              src={slide.image!}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50" />
        </div>
      ))}

      <div className={`relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-1000`}>
        <div className="max-w-4xl">
          {slides[currentSlide].type === 'video' ? (
            <>
              <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-light tracking-wider mb-3">
                {slides[currentSlide].title}
              </h1>
              <p className="text-white/80 text-sm md:text-base mb-5 font-light max-w-xl mx-auto tracking-wide">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <Link href={slides[currentSlide].ctaLink || '/rooms'} className="btn-primary group relative overflow-hidden px-8 py-4">
                  <span className="relative z-10 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {slides[currentSlide].ctaText}
                  </span>
                  <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-0 transition-transform duration-500" />
                </Link>
                <Link href="/#about" className="btn-secondary group px-8 py-4">
                  <span className="relative z-10">Learn More</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm md:text-base tracking-[0.4em] uppercase mb-6 opacity-90 font-light">
                {slides[currentSlide].subtitle}
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-light tracking-wide mb-4">
                {slides[currentSlide].title}
              </h1>
              <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto mb-8 font-light">
                Experience unparalleled luxury and comfort in the heart of Calais. Your sanctuary awaits exquisite hospitality and memorable moments.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <Link href="/#about" className="btn-primary group relative overflow-hidden">
                  <span className="relative z-10">Discover More</span>
                  <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-0 transition-transform duration-500" />
                </Link>
                <Link href="/rooms" className="btn-secondary group">
                  <span className="relative z-10">Reserve Now</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/40 hover:border-white/30 hover:scale-110 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-[-2px] transition-all" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-black/40 hover:border-white/30 hover:scale-110 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white/80 group-hover:text-white group-hover:translate-x-[2px] transition-all" />
      </button>

      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => {document.body.style.cursor = 'pointer';}}
            onMouseLeave={() => {document.body.style.cursor = 'auto';}}
            className={`h-0.5 md:h-1 rounded-full transition-all duration-500 hover:scale-125 ${
              index === currentSlide 
                ? 'bg-white w-12 md:w-16' 
                : 'bg-white/30 w-3 md:w-4 hover:bg-white hover:w-6 md:hover:w-8'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-20 text-white/60 text-sm font-light tracking-widest">
        {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  );
}
