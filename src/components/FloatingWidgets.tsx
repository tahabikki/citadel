'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, Send, X } from 'lucide-react';

const chatbotGreetings = [
  'Welcome to Citadel Hôtel! How can I help you today?',
  "Hello! I'm here to assist you with your booking.",
  'Hi there! What would you like to know about our hotel?',
];

const chatbotResponses: Record<string, string> = {
  booking: "You can book directly on our website by selecting your dates and room. Click 'Reserve' to start!",
  price: 'Our rooms range from €59-200 per night. Would you like to see all room options?',
  'check in': 'Check-in is available 24/7. Standard check-in is from 2 PM, but early/late check-in can be arranged.',
  location: "We're located next to the ferry terminal in Calais, France.",
  wifi: 'Yes! Free high-speed WiFi is available throughout the hotel.',
  pets: "Yes! We're pet-friendly. Please confirm at booking.",
  breakfast: 'Yes, buffet breakfast is available from 7-10 AM for €12 per person.',
  default: "I'd be happy to help! Please contact our front desk for more details.",
};

function findResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(chatbotResponses)) {
    if (lower.includes(key)) return response;
  }
  return chatbotResponses.default;
}

export function FloatingWidgets() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ text: string; sender: 'bot' | 'user' }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 260);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowChatbot(false);
  }, [pathname]);

  useEffect(() => {
    if (showChatbot && chatMessages.length === 0) {
      const randomGreeting = chatbotGreetings[Math.floor(Math.random() * chatbotGreetings.length)];
      setChatMessages([{ text: randomGreeting, sender: 'bot' }]);
    }
  }, [showChatbot, chatMessages.length]);

  useEffect(() => {
    if (!showChatbot) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowChatbot(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showChatbot]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    setChatMessages((prev) => [...prev, { text, sender: 'user' }]);
    setInputValue('');
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { text: findResponse(text), sender: 'bot' }]);
    }, 450);
  };

  const whatsappLink = 'https://wa.me/33621970000';

  if (!hasMounted) return null;

  return (
    <>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="relative group">
          <div className="absolute -inset-2 bg-[#c9a86c] rounded-full animate-pulse opacity-30" />
          <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer border border-[#c9a86c]/40 group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-[1.04]">
            <svg className="w-7 h-7" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#c9a86c"
                d="M20.52 3.48A11.87 11.87 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.32-1.66a11.85 11.85 0 005.74 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.43zM12.07 21.1h-.01a9.89 9.89 0 01-5.04-1.39l-.36-.22-3.75.98 1-3.66-.24-.38a9.86 9.86 0 01-1.52-5.23c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 012.9 7 9.89 9.89 0 01-9.86 9.9zm5.42-7.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.46-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.64-.93-2.25-.24-.57-.48-.49-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.52 0 1.48 1.09 2.92 1.24 3.12.15.2 2.14 3.27 5.18 4.59.72.31 1.28.5 1.72.64.72.23 1.37.2 1.88.12.57-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.08-.12-.28-.2-.58-.35z"
              />
            </svg>
          </div>
        </div>
      </a>

      <button
        type="button"
        onClick={() => setShowChatbot((s) => !s)}
        aria-label={showChatbot ? 'Close chatbot' : 'Open chatbot'}
        className={`fixed bottom-24 right-6 z-50 transition-all duration-500 ${
          scrolled ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="relative group">
          <div className="absolute -inset-2 bg-[#c9a86c] rounded-full animate-pulse opacity-30" />
          <div className="relative w-14 h-14 bg-[#c9a86c] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all">
            {showChatbot ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
          </div>
        </div>
      </button>

      {showChatbot && (
        <>
          <button
            type="button"
            aria-label="Close chatbot overlay"
            className="fixed inset-0 z-40 cursor-pointer bg-transparent"
            onClick={() => setShowChatbot(false)}
          />

          <div
            className="fixed bottom-28 right-6 w-80 h-[450px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-[var(--border-light)]"
            role="dialog"
            aria-label="Chatbot"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#c9a86c] p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">Citadel Assistant</h3>
                <p className="text-xs text-white/80">Online now</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowChatbot(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-[#c9a86c] text-white rounded-br-md'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[var(--border-light)] flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a86c]"
                autoFocus
              />
              <button
                type="button"
                onClick={sendMessage}
                className="w-10 h-10 bg-[#c9a86c] rounded-full flex items-center justify-center hover:bg-[#b8956a] transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

