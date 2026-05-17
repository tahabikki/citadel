'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'en' | 'fr' | 'de' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translatePage: () => void;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const languageNames: Record<Language, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español'
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  const translatePage = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    setIsTranslating(true);
    
    const checkTranslate = setInterval(() => {
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (frame) {
        frame.style.display = 'none';
      }
      
      const translateButton = document.querySelector('.goog-te-button') as HTMLElement;
      if (translateButton && (translateButton as any).click) {
        clearInterval(checkTranslate);
        setTimeout(() => setIsTranslating(false), 1000);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const existingWidget = document.getElementById('google-translate-container');
    if (!existingWidget) {
      const widgetContainer = document.createElement('div');
      widgetContainer.id = 'google-translate-container';
      widgetContainer.style.position = 'absolute';
      widgetContainer.style.top = '-9999px';
      widgetContainer.style.width = '200px';
      widgetContainer.style.height = '50px';
      document.body.appendChild(widgetContainer);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,fr,de,es',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, 'google-translate-container');
        }
      };

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }

    const hideBanner = setInterval(() => {
      const frame = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (frame) {
        frame.style.display = 'none';
      }
    }, 500);

    return () => clearInterval(hideBanner);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        const langMap: Record<string, string> = {
          en: 'en',
          fr: 'fr',
          de: 'de',
          es: 'es'
        };
        if (langMap[language] && select.value !== langMap[language]) {
          select.value = langMap[language];
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        const frame = document.querySelector('.goog-te-banner-frame') as HTMLElement;
        if (frame) {
          frame.style.display = 'none';
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translatePage, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export { languageNames };