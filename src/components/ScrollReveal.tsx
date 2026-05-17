'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollAnimation(options: ScrollOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const apply = () => setReducedMotion(Boolean(media.matches));
    apply();
    if (media.addEventListener) media.addEventListener('change', apply);
    else media.addListener(apply);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', apply);
      else media.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.once !== false) {
            observer.disconnect();
          }
        } else if (options.once === false) {
          setIsVisible(false);
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px',
      }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once, reducedMotion]);

  return { ref, isVisible };
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.12,
  durationMs = 900,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'none';
  delay?: number;
  threshold?: number;
  durationMs?: number;
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold, once: true });

  const animations = {
    'fade-up': 'translate-y-10 blur-[2px]',
    'fade-left': '-translate-x-10 blur-[2px]',
    'fade-right': 'translate-x-10 blur-[2px]',
    scale: 'scale-[0.98] blur-[2px]',
    none: '',
  } as const;

  const visibleAnimations = {
    'fade-up': 'translate-y-0 blur-0',
    'fade-left': 'translate-x-0 blur-0',
    'fade-right': 'translate-x-0 blur-0',
    scale: 'scale-100 blur-0',
    none: '',
  } as const;

  return (
    <div
      ref={ref}
      className={`will-change-transform will-change-opacity transition-[opacity,transform,filter] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible ? `opacity-100 ${visibleAnimations[animation]}` : `opacity-0 ${animations[animation]}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: `${durationMs}ms` }}
    >
      {children}
    </div>
  );
}

