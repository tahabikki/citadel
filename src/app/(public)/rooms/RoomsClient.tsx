'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Users, Check, Wifi, Wind, Coffee, Maximize2, SlidersHorizontal, Star, BedDouble, Search } from 'lucide-react';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { mediaUrl } from '@/lib/images';

type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  maxGuests: number;
  amenities?: string[];
  imageUrl?: string | null;
  description: string;
  roomNumber?: string;
};

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'AC': <Wind className="w-4 h-4" />,
  'Mini Bar': <Coffee className="w-4 h-4" />,
  'Room Service': <Maximize2 className="w-4 h-4" />,
};

function getRoomTypeLabel(type: string) {
  const types: Record<string, string> = {
    'SINGLE': 'Single',
    'DOUBLE': 'Double',
    'TWIN': 'Twin',
    'FAMILY': 'Family',
    'SUITE': 'Suite',
    'PENTHOUSE': 'Penthouse',
  };
  return types[type] || type;
}

export default function RoomsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [checkInDate, setCheckInDate] = useState(searchParams.get('checkIn') || '');
  const [checkOutDate, setCheckOutDate] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 2);
  
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'guests' | 'name'>('price-asc');
  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const params = new URLSearchParams({ includeAll: 'true' });
        if (checkInDate && checkOutDate) {
          params.set('checkIn', checkInDate);
          params.set('checkOut', checkOutDate);
        }
        if (guests) params.set('guests', String(guests));
        
        const res = await fetch(`/api/rooms?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rooms');
        const list = Array.isArray(data.rooms) ? data.rooms : [];
        setRooms(list.map((r: any) => ({
          id: String(r.id),
          name: r.name || r.type,
          type: r.type,
          price: Number(r.price),
          maxGuests: Number(r.maxGuests),
          amenities: r.amenities || [],
          imageUrl: r.imageUrl || null,
          description: r.description || '',
          roomNumber: r.roomNumber || r.id,
        })));
      } catch (err) {
        setRooms([]);
        setLoadError(err instanceof Error ? err.message : 'Failed to fetch rooms');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, [checkInDate, checkOutDate, guests]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    return Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
  }, [checkInDate, checkOutDate]);

  const filteredRooms = useMemo(() => {
    let result = [...rooms];
    if (typeFilter !== 'ALL') result = result.filter(r => r.type === typeFilter);
    result = result.filter(r => r.price >= priceRange[0] && r.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'guests': result.sort((a, b) => b.maxGuests - a.maxGuests); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [rooms, typeFilter, priceRange, sortBy]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`/rooms?${params.toString()}`);
  };

  const runSearch = () => {
    updateFilters({
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: String(guests),
    });
  };

  const handleReserve = (room: Room) => {
    const draftId = 'DRAFT-' + Date.now();
    const params = new URLSearchParams({
      draftId,
      checkIn: checkInDate || new Date().toISOString().split('T')[0],
      checkOut: checkOutDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      guests: String(guests),
      roomId: room.id,
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const roomTypes = [
    { value: 'ALL', label: 'All Types' },
    { value: 'SINGLE', label: 'Single' },
    { value: 'DOUBLE', label: 'Double' },
    { value: 'TWIN', label: 'Twin' },
    { value: 'FAMILY', label: 'Family' },
    { value: 'SUITE', label: 'Suite' },
    { value: 'PENTHOUSE', label: 'Penthouse' },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-[#faf9f7]">
        <section className="py-10 bg-gradient-to-b from-[#1a1a1a] via-[#252525] to-[#2d2d2d] text-white">
          <div className="container-custom">
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl mb-2">Book Your Stay</h1>
              <p className="text-white/60">Choose dates, guests, and browse available rooms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl">
              <div className="w-full p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:border-white/20 transition-all text-left flex flex-col gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in
                </span>
                <input
                  type="date"
                  value={checkInDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCheckInDate(value);
                    if (checkOutDate && new Date(checkOutDate) <= new Date(value)) {
                      setCheckOutDate('');
                    }
                  }}
                  className="bg-transparent text-lg font-medium text-white outline-none [color-scheme:dark]"
                />
              </div>

              <label className="w-full p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:border-white/20 transition-all text-left flex flex-col gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-out
                </span>
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="bg-transparent text-lg font-medium text-white outline-none [color-scheme:dark]"
                />
              </label>

              <label className="w-full p-4 bg-white/10 backdrop-blur rounded-xl border border-white/10 hover:border-white/20 transition-all text-left flex flex-col gap-2">
                <span className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Guests
                </span>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    value={guests}
                    min={1}
                    max={6}
                    onChange={(e) => setGuests(Math.min(6, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-20 bg-transparent text-lg font-medium text-white outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                    <button type="button" onClick={() => setGuests((g) => Math.min(6, g + 1))} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={runSearch}
                className="btn-primary h-full min-h-[76px] rounded-xl flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Rooms
              </button>
            </div>
          </div>
        </section>

        <div className="container-custom py-16 mt-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-28">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#867050]/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-[#867050]" />
                    <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  <div>
                    <label className="text-sm font-semibold text-gray-800 mb-4 block">
                      Room Type
                    </label>
                    <div className="space-y-2">
                      {roomTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setTypeFilter(type.value)}
                          className={`w-full px-4 py-3 rounded-lg transition-all text-sm font-medium text-left ${
                            typeFilter === type.value 
                              ? 'bg-[#867050] text-white shadow-md' 
                              : 'hover:bg-gray-50 text-gray-600 border border-transparent'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <label className="text-sm font-semibold text-gray-800 mb-4 block">
                      Price Range
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#867050] focus:ring-1 focus:ring-[#867050]"
                          placeholder="Min"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#867050] focus:ring-1 focus:ring-[#867050]"
                          placeholder="Max"
                        />
                      </div>
                      <div className="flex gap-2">
                        {[0, 100, 200, 500].map(p => (
                          <button
                            key={p}
                            onClick={() => setPriceRange([p, p === 500 ? 1000 : p + 100])}
                            className="flex-1 py-2.5 text-xs rounded-lg bg-gray-100 hover:bg-[#867050]/20 hover:text-[#867050] transition-colors font-medium"
                          >
                            {p === 0 ? 'Any' : `€${p}+`}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6">
                    <label className="text-sm font-semibold text-gray-800 mb-4 block">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:border-[#867050] focus:ring-1 focus:ring-[#867050] bg-white"
                    >
                      <option value="price-asc">Price: Low → High</option>
                      <option value="price-desc">Price: High → Low</option>
                      <option value="guests">Most Guests</option>
                      <option value="name">Name A → Z</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setTypeFilter('ALL'); setPriceRange([0, 1000]); setSortBy('price-asc'); }}
                    className="w-full py-3 text-sm text-[#867050] hover:bg-[#867050]/10 rounded-lg transition-colors font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-h-0">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#867050]/10 flex items-center justify-center">
                    <BedDouble className="w-6 h-6 text-[#867050]" />
                  </div>
                  <div>
                    <p className="font-semibold text-xl text-gray-900">{filteredRooms.length} Room{filteredRooms.length !== 1 ? 's' : ''} Available</p>
                    {checkInDate && checkOutDate && (
                      <p className="text-sm text-gray-500">{nights} night{nights > 1 ? 's' : ''} · {guests} guest{guests > 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-24">
                  <div className="w-10 h-10 border-3 border-[#867050] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-500">Finding available rooms...</p>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                  <div className="w-24 h-24 bg-[#867050]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BedDouble className="w-12 h-12 text-[#867050]" />
                  </div>
                  <h4 className="font-semibold text-2xl text-gray-900 mb-3">{loadError ? 'Rooms could not load' : 'No rooms found'}</h4>
                  <p className="text-gray-500 mb-6">{loadError || 'Try adjusting your filters to see more options'}</p>
                  <button 
                    onClick={() => { setTypeFilter('ALL'); setPriceRange([0, 1000]); }}
                    className="px-8 py-3 bg-[#867050] text-white rounded-xl hover:bg-[#9d7a5a] transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#867050]/30 transition-all duration-300"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={room.imageUrl || mediaUrl('image_001.jpg')}
                          alt={room.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute top-5 left-5 px-4 py-2 bg-white/95 backdrop-blur rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                          {getRoomTypeLabel(room.type)}
                        </div>
                        <div className="absolute top-5 right-5 px-4 py-2 bg-[#867050] rounded-lg text-sm font-semibold text-white shadow-sm">
                          Room {room.roomNumber}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-2xl text-gray-900">{room.name}</h3>
                            <div className="flex items-center gap-1 mt-2">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-500">4.8</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-base text-gray-500 mb-5 line-clamp-2">{room.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-5">
                          {room.amenities?.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600">
                              {amenityIcons[amenity] || <Check className="w-3 h-3" />}
                              {amenity}
                            </span>
                          ))}
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600">
                            <Users className="w-3 h-3" />
                            Up to {room.maxGuests}
                          </span>
                        </div>
                        
                        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-3xl font-bold text-[#867050]">
                              €{nights > 1 ? room.price * nights : room.price}
                            </p>
                            <p className="text-sm text-gray-400">
                              {nights > 1 ? `€${room.price} × ${nights} nights` : 'per night'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleReserve(room)}
                            className="px-8 py-4 bg-gradient-to-r from-[#867050] to-[#9d7a5a] text-white font-medium rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                          >
                            Reserve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
