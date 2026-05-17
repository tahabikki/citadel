'use client';

import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Marie Dubois',
    role: 'Business Traveler',
    location: 'Paris, France',
    text: 'An absolutely stunning hotel with exceptional service. The staff went above and beyond to make our anniversary special. The room was beautifully decorated and the view was breathtaking.',
    rating: 5,
    initials: 'MD',
    color: 'bg-[#867050]'
  },
  {
    id: 2,
    name: 'James Mitchell',
    role: 'Couple',
    location: 'London, UK',
    text: 'Perfect location for our Calais getaway. The rooms are elegant, clean, and comfortable. The breakfast was delicious and the staff was incredibly helpful with local recommendations.',
    rating: 5,
    initials: 'JM',
    color: 'bg-[#a68B5B]'
  },
  {
    id: 3,
    name: 'Hans Mueller',
    role: 'Solo Traveler',
    location: 'Berlin, Germany',
    text: 'Excellent value for money. The hotel is beautifully maintained with classic French charm. Walking distance to the ferry terminal made our journey seamless. Would definitely return!',
    rating: 5,
    initials: 'HM',
    color: 'bg-[#c9a86c]'
  },
  {
    id: 4,
    name: 'Sophie Laurent',
    role: 'Family',
    location: 'Lyon, France',
    text: 'We had an amazing stay with our children. The family room was spacious and the staff was so welcoming. The location is perfect for exploring Calais.',
    rating: 5,
    initials: 'SL',
    color: 'bg-[#6b5b3d]'
  },
  {
    id: 5,
    name: 'Marco Rossi',
    role: 'Couple',
    location: 'Rome, Italy',
    text: 'Romantic getaway was absolutely perfect! The suite was stunning, the restaurant exceeded expectations, and the service was impeccable.',
    rating: 5,
    initials: 'MR',
    color: 'bg-[#8b7355]'
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section className="section-padding bg-[var(--background)]">
      <div className="container-custom">
        <div className="text-center mb-8">
          <p className="text-sm tracking-[0.2em] uppercase text-[var(--secondary)] mb-2">Testimonials</p>
          <h2 className="font-display text-3xl md:text-4xl">What Our Guests Say</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-[var(--card)] rounded-xl p-8 md:p-12 border border-[var(--border-light)]">
            <Quote className="w-12 h-12 text-[var(--primary)]/20 absolute top-6 left-6" />
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-[var(--primary)]/20 flex items-center justify-center ${current.color}`}>
                  <span className="text-white text-2xl md:text-3xl font-medium">{current.initials}</span>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg md:text-xl text-[var(--foreground)]/80 leading-relaxed mb-6 italic">
                  &ldquo;{current.text}&rdquo;
                </p>
                
                <div className="flex justify-center md:justify-start gap-1 mb-2">
                  {[...Array(current.rating)].map((_, i) => (
                    <span key={i} className="text-[#c9a86c] text-lg">★</span>
                  ))}
                </div>
                
                <div>
                  <p className="font-semibold text-lg">{current.name}</p>
                  <p className="text-sm text-[var(--secondary)]">{current.role} • {current.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button 
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border-light)] hover:border-[var(--primary)] transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`flex gap-2 items-center`}
                >
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? 'bg-[var(--primary)] w-8' 
                      : 'bg-[var(--border)] hover:bg-[var(--secondary)]'
                  }`} />
                </button>
              ))}
            </div>

            <button 
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-[var(--card)] border border-[var(--border-light)] hover:border-[var(--primary)] transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-6">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`group relative ${index !== activeIndex ? 'opacity-60 hover:opacity-100' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all flex items-center justify-center ${
                  index === activeIndex 
                    ? 'ring-[var(--primary)] scale-110' 
                    : 'ring-transparent group-hover:ring-[var(--border)]'
                } ${testimonial.color}`}>
                  <span className="text-white text-xs font-medium">{testimonial.initials}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}