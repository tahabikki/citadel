'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Subscribed:', email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="border-b border-white/5 py-20">
        <div className="container-custom px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-4xl md:text-5xl mb-4">Stay Connected</h3>
            <p className="text-white/50 text-lg mb-8 font-light leading-relaxed">
              Sign up for exclusive offers and inspiration from the world of luxury hospitality.
            </p>
            {subscribed ? (
              <p className="text-[var(--primary)] font-medium text-lg py-4">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded text-white placeholder-white/30 focus:border-[var(--primary)] focus:bg-white/10 transition-all"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap px-8">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom" style={{ padding: '6rem 3rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16">
          <div className="space-y-8">
            <div className="relative w-40 h-40">
              <Image
                src="/logo/gold_logo.png"
                alt="Citadel Hôtel"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              Experience the art of hospitality at Citadel Hôtel. Where every moment becomes a cherished memory.
            </p>
            </div>

          <div className="space-y-8">
            <h4 className="text-lg font-medium tracking-wide">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/80">Citadel Hôtel</p>
                  <p className="text-white/50 text-sm">28 rue Royale, 62100 Calais</p>
                  <p className="text-white/50 text-sm">France</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--primary)] shrink-0" />
                <a href="tel:+33321970000" className="text-white/70 hover:text-[var(--primary)] transition-colors cursor-pointer">+33 3 21 97 00 00</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--primary)] shrink-0" />
                <a href="mailto:contact@citadelhotel.fr" className="text-white/70 hover:text-[var(--primary)] transition-colors cursor-pointer">contact@citadelhotel.fr</a>
              </div>
              <div className="flex gap-3 pt-2">
                <a href="#" className="p-2 bg-white/5 rounded hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 cursor-pointer">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-white/5 rounded hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-white/5 rounded hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 cursor-pointer">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="#" className="p-2 bg-white/5 rounded hover:bg-[var(--primary)] hover:scale-110 transition-all duration-300 cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-medium tracking-wide">Explore</h4>
            <ul className="space-y-3">
              <li><Link href="/rooms" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Rooms & Suites</Link></li>
              <li><Link href="/dining" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Dining</Link></li>
              <li><Link href="/offers" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Offers</Link></li>
              <li><Link href="/gallery" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Gallery</Link></li>
              <li><Link href="/experience" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Experience</Link></li>
              <li><Link href="/contact" className="text-white/50 hover:text-[var(--primary)] hover:pl-2 transition-all duration-300 text-sm cursor-pointer">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-medium tracking-wide">Legal</h4>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-white/50 hover:text-[var(--primary)] transition-colors text-sm cursor-pointer">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-lg font-medium tracking-wide">We Accept</h4>
            <div className="flex gap-3 flex-wrap">
              <i className="fa-brands fa-cc-visa text-2xl text-white/70"></i>
              <i className="fa-brands fa-cc-mastercard text-2xl text-white/70"></i>
              <i className="fa-brands fa-cc-amex text-2xl text-white/70"></i>
              <i className="fa-brands fa-cc-paypal text-2xl text-white/70"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} Citadel Hôtel. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>Crafted with</span>
              <span className="text-[var(--primary)]">♥</span>
              <span>for luxury hospitality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}