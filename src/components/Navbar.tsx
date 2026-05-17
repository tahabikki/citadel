'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Phone, Sun, Moon, ChevronDown, Globe } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingWidget = document.getElementById('google-translate-nav');
    if (!existingWidget) {
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'google-translate-nav';
      widgetContainer.style.position = 'absolute';
      widgetContainer.style.top = '-9999px';
      widgetContainer.style.visibility = 'hidden';
      document.body.appendChild(widgetContainer);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,fr,de,es',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google-translate-nav');
        }
      };

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    const hideBanner = setInterval(() => {
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (frame) frame.style.display = 'none';
    }, 300);

    const applyLanguage = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        const langMap: Record<string, string> = { en: 'en', fr: 'fr', de: 'de', es: 'es' };
        if (langMap[currentLang] && select.value !== langMap[currentLang]) {
          select.value = langMap[currentLang];
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        clearInterval(applyLanguage);
      }
    }, 500);

    return () => {
      clearInterval(hideBanner);
      clearInterval(applyLanguage);
    };
  }, [currentLang]);

  const menuItems = [
    { label: 'Rooms & Suites', href: '/rooms' },
    { label: 'Dining', href: '/dining' },
    { label: 'Offers', href: '/offers' },
    { label: 'Experience', href: '/experience' },
    { label: 'Gallery', href: '/gallery' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md bg-black/60 dark:bg-black/60 border-b border-white/10">
      <div className="container-custom">
        <div className="flex items-center justify-between h-24">
          <button
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="relative w-32 h-32 transition-transform hover:scale-105">
              <Image
                src={theme === 'dark' ? '/logo/white_logo.png' : '/logo/gold_logo.png'}
                alt="Citadel Hôtel"
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            </button>
            <Link 
              href="/contact" 
              className="hidden md:flex items-center gap-2 text-sm text-white hover:text-[var(--primary)] transition-colors px-3 py-2 hover:bg-white/10 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-sm text-white hover:text-[var(--primary)] transition-colors px-3 py-2 hover:bg-white/10 rounded-lg"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{languages.find(l => l.code === currentLang)?.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border-light)] rounded-lg shadow-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--card-hover)] transition-colors flex items-center gap-3 ${
                        currentLang === lang.code ? 'text-[var(--primary)] bg-[var(--card-hover)]' : 'text-[var(--foreground)]'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute top-24 left-0 w-80 min-h-screen bg-black/95 backdrop-blur-xl border-r border-white/10 transition-all duration-500 z-40 ${
        isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        <nav className="p-8">
          <ul className="space-y-6">
            {menuItems.map((item, index) => (
              <li 
                key={item.label}
                className={`transform transition-all duration-300 ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' }}
              >
                <Link 
                  href={item.href} 
                  className="block py-3 text-xl text-white/80 hover:text-[var(--primary)] hover:pl-4 transition-all duration-300 border-b border-white/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-12 pt-8 border-t border-white/10">
            <Link 
              href="/rooms"
              className="block w-full text-center btn-primary mb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Now
            </Link>
            <Link 
              href="/contact"
              className="block text-center text-white/60 hover:text-white text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Need Help?
            </Link>
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}