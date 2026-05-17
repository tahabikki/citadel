'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wifi, Wind, Coffee, Maximize2, Users, Star, BedDouble, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function formatDateForInput(date: Date) {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'wifi': <Wifi className="w-4 h-4" />,
  'AC': <Wind className="w-4 h-4" />,
  'ac': <Wind className="w-4 h-4" />,
  'Mini Bar': <Coffee className="w-4 h-4" />,
  'mini bar': <Coffee className="w-4 h-4" />,
  'Room Service': <Maximize2 className="w-4 h-4" />,
  'room service': <Maximize2 className="w-4 h-4" />,
};

export function BookingSection() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [checkInDate, setCheckInDate] = useState(formatDateForInput(today));
  const [checkOutDate, setCheckOutDate] = useState(formatDateForInput(tomorrow));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCal, setActiveCal] = useState<'checkin' | 'checkout' | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('[data-calendar]') && !t.closest('[data-date-btn]') && !t.closest('[data-drawer]')) {
        setActiveCal(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: String(adults + children),
      adults: String(adults),
      children: String(children),
      rooms: String(rooms)
    });
    router.push(`/rooms?${params.toString()}`);
  };

  const nights = Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
  const totalGuests = adults + children;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const shortWeekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const goToPrevYear = () => setCalYear(calYear - 1);
  const goToNextYear = () => setCalYear(calYear + 1);
  
  const goToPrevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else { setCalMonth(calMonth - 1); }
  };
  
  const goToNextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else { setCalMonth(calMonth + 1); }
  };

  const selectDate = (day: number) => {
    const dateStr = formatDateForInput(new Date(calYear, calMonth, day));
    if (activeCal === 'checkin') {
      setCheckInDate(dateStr);
      if (new Date(dateStr) >= new Date(checkOutDate)) {
        const nd = new Date(calYear, calMonth, day);
        nd.setDate(nd.getDate() + 1);
        setCheckOutDate(formatDateForInput(nd));
      }
    } else {
      if (new Date(dateStr) > new Date(checkInDate)) {
        setCheckOutDate(dateStr);
      }
    }
    setActiveCal(null);
  };

  const isDateDisabled = (day: number) => {
    const dateStr = formatDateForInput(new Date(calYear, calMonth, day));
    if (activeCal === 'checkin') return new Date(dateStr) < today;
    return new Date(dateStr) <= new Date(checkInDate);
  };

  const getRoomTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'SINGLE': 'Single',
      'DOUBLE': 'Double',
      'TWIN': 'Twin',
      'FAMILY': 'Family',
      'SUITE': 'Suite',
      'PENTHOUSE': 'Penthouse',
      'DELUXE': 'Deluxe'
    };
    return types[type] || type;
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf9f7] via-[#f5f3ef] to-[#ebe8e1]" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-12">
          <span className="text-[#867050] text-xs font-medium tracking-[0.3em] uppercase mb-3 block">Exclusive Stays</span>
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">Reserve Your Experience</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Discover our collection of exceptional rooms and suites designed for the discerning traveler</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-8 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                  <span>{nights} Night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>{totalGuests} Guest{totalGuests > 1 ? 's' : ''}</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <span>{rooms} Room{rooms > 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <span className="text-white/50 text-xs">Total Estimate</span>
                  <p className="text-white font-semibold text-lg">From €{Math.round(89 * nights)}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button 
                  data-date-btn
                  type="button"
                  onClick={() => { setActiveCal('checkin'); setCalYear(new Date(checkInDate).getFullYear()); setCalMonth(new Date(checkInDate).getMonth()); }}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${activeCal === 'checkin' ? 'border-[#867050] bg-[#867050]/5 shadow-md' : 'border-gray-100 hover:border-[#867050]/50 bg-gray-50/50'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#867050]/10 flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-[#867050]" />
                  </div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Check-in</span>
                  <div className="font-semibold text-xl text-gray-800">{formatDisplayDate(checkInDate)}</div>
                </button>
                <button 
                  data-date-btn
                  type="button"
                  onClick={() => { setActiveCal('checkout'); setCalYear(new Date(checkOutDate).getFullYear()); setCalMonth(new Date(checkOutDate).getMonth()); }}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${activeCal === 'checkout' ? 'border-[#867050] bg-[#867050]/5 shadow-md' : 'border-gray-100 hover:border-[#867050]/50 bg-gray-50/50'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#867050]/10 flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-[#867050]" />
                  </div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Check-out</span>
                  <div className="font-semibold text-xl text-gray-800">{formatDisplayDate(checkOutDate)}</div>
                </button>
                <div className="p-5 rounded-xl border-2 border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-[#867050]/10 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 text-[#867050]" />
                  </div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">Guests</span>
                  <div className="flex items-center gap-3 w-full justify-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 mt-1">Adults</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">−</button>
                        <span className="font-semibold text-base text-gray-800 w-6 text-center">{adults}</span>
                        <button type="button" onClick={() => setAdults(Math.min(6, adults + 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">+</button>
                      </div>   
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 mt-1">Children</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">−</button>
                        <span className="font-semibold text-base text-gray-800 w-6 text-center">{children}</span>
                        <button type="button" onClick={() => setChildren(Math.min(4, children + 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">+</button>
                      </div>
                      
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] text-gray-400 mt-1">Rooms</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">−</button>
                        <span className="font-semibold text-base text-gray-800 w-6 text-center">{rooms}</span>
                        <button type="button" onClick={() => setRooms(Math.min(5, rooms + 1))} className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-[#867050]/20 text-sm font-bold text-gray-600 transition-colors">+</button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

              {activeCal && (
                <div data-calendar className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-3 shadow-sm">
                    <button type="button" onClick={goToPrevYear} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#867050]/20 flex items-center justify-center font-bold text-lg text-gray-600 hover:text-[#867050] transition-colors">«</button>
                    <span className="font-bold text-2xl text-[#867050]">{calYear}</span>
                    <button type="button" onClick={goToNextYear} className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#867050]/20 flex items-center justify-center font-bold text-lg text-gray-600 hover:text-[#867050] transition-colors">»</button>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {monthNames.map((name, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setCalMonth(i); }}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                          i === calMonth 
                            ? 'bg-[#867050] text-white shadow-md' 
                            : 'bg-white hover:bg-[#867050]/10 text-gray-600'
                        }`}
                      >
                        {name.slice(0, 3)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={goToPrevMonth} className="p-2 hover:bg-white rounded-lg transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <span className="font-semibold text-lg text-gray-800">{monthNames[calMonth]} {calYear}</span>
                    <button type="button" onClick={goToNextMonth} className="p-2 hover:bg-white rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {shortWeekDays.map((d, i) => (
                      <span key={i} className="text-xs font-semibold text-gray-400 py-2">{d}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {blanks.map(i => <span key={`b${i}`} className="p-2" />)}
                    {days.map(day => {
                      const dateStr = formatDateForInput(new Date(calYear, calMonth, day));
                      const isCheckIn = dateStr === checkInDate;
                      const isCheckOut = dateStr === checkOutDate;
                      const isToday = dateStr === formatDateForInput(today);
                      return (
                        <button
                          key={day}
                          type="button"
                          disabled={isDateDisabled(day)}
                          onClick={() => selectDate(day)}
                          className={`p-2.5 text-sm rounded-lg transition-all ${
                            isDateDisabled(day) 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : isCheckIn || isCheckOut 
                                ? 'bg-[#867050] text-white shadow-md font-semibold' 
                                : isToday
                                  ? 'ring-2 ring-[#867050] text-[#867050] bg-white' 
                                  : 'hover:bg-[#867050]/20 hover:text-[#867050] text-gray-600'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading || isSearching}
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-[#867050] to-[#9d7a5a] text-white text-base font-semibold rounded-xl hover:shadow-lg hover:shadow-[#867050]/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading || isSearching ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching Availability...
                  </>
                ) : (
                  <>
                    <Building2 className="w-5 h-5" />
                    Check Availability
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      </section>
  );
}
