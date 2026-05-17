'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { mediaImageFiles, mediaUrl } from '@/lib/images';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');
const apiPath = (path: string) => `${API_BASE}${path}`;

import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  Calendar, 
  CreditCard, 
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Key,
  DollarSign,
  Building,
  Plus,
  Trash2,
  Edit,
  Globe,
  ClipboardList,
  Truck,
  BarChart3,
  Link2,
  UserCheck,
  Sparkles,
  Utensils,
  Wrench,
  Shirt,
  Package,
  RefreshCw,
  Banknote,
  ImageIcon,
  Upload,
  X,
  Menu
} from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
}

interface Task {
  id: string;
  type: string;
  status: string;
  roomNumber: string;
  reservation: {
    user: { firstName: string; lastName: string };
  };
  createdAt: string;
}

interface Stats {
  totalRooms: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalReservations: number;
  pendingPayments: number;
}

type AdminRoom = {
  id: string;
  roomNumber: string;
  name: string;
  type: string;
  price: number;
  status: string;
  imageUrl?: string;
  availability?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  floor?: number;
  maxGuests?: number;
  amenities?: string[];
};

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
}

interface Task {
  id: string;
  type: string;
  status: string;
  roomNumber: string;
  reservation: {
    user: { firstName: string; lastName: string };
  };
  createdAt: string;
}

interface Stats {
  totalRooms: number;
  availableRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  totalReservations: number;
  pendingPayments: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [adminLang, setAdminLang] = useState('en');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalReservations: 0,
    pendingPayments: 0
  });
  const [loading, setLoading] = useState(false);

  const [adminRooms, setAdminRooms] = useState<AdminRoom[]>([]);

  const [roomFilter, setRoomFilter] = useState<'ALL' | 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED'>('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('ALL');

  const updateRoomAvailability = async (id: string, availability: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED') => {
    const previousRooms = adminRooms;
    setAdminRooms(prev => prev.map(r => {
      if (r.id === id) {
        const statusMap: Record<string, string> = {
          'AVAILABLE': 'Available',
          'OCCUPIED': 'Occupied',
          'MAINTENANCE': 'Maintenance',
          'RESERVED': 'Reserved'
        };
        return { ...r, availability, status: statusMap[availability] };
      }
      return r;
    }));

    try {
      const res = await fetch(apiPath('/rooms'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: availability })
      });
      if (!res.ok) throw new Error('Failed to update room status');
    } catch (error) {
      console.error('Room status update failed:', error);
      setAdminRooms(previousRooms);
    }
  };

  const [staffList, setStaffList] = useState<any[]>([]);

  const [housekeepingTasks, setHousekeepingTasks] = useState<any[]>([]);

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  const [seasonalRates, setSeasonalRates] = useState([
    { id: '1', name: 'Low Season', seasonType: 'LOW_SEASON', startDate: '2026-01-01', endDate: '2026-03-31', multiplier: 0.8, isActive: true },
    { id: '2', name: 'Regular', seasonType: 'REGULAR', startDate: '2026-04-01', endDate: '2026-06-30', multiplier: 1.0, isActive: true },
    { id: '3', name: 'High Season', seasonType: 'HIGH_SEASON', startDate: '2026-07-01', endDate: '2026-08-31', multiplier: 1.5, isActive: true },
    { id: '4', name: 'Regular', seasonType: 'REGULAR', startDate: '2026-09-01', endDate: '2026-10-31', multiplier: 1.0, isActive: true },
    { id: '5', name: 'Peak Season', seasonType: 'PEAK_SEASON', startDate: '2026-11-01', endDate: '2026-12-31', multiplier: 1.3, isActive: true },
  ]);

  const existingImages = mediaImageFiles;

  const [mediaItems, setMediaItems] = useState(
    existingImages.map((filename, index) => ({
      id: String(index + 1),
      url: mediaUrl(filename),
      filename,
      type: index < 2 ? 'ROOM' : index < 10 ? 'HOTEL' : index < 14 ? 'RESTAURANT' : index < 17 ? 'FACILITY' : 'GALLERY',
      isActive: true
    }))
  );

  useEffect(() => {
    const syncMediaToDatabase = async () => {
      try {
        const res = await fetch(apiPath('/media'));
        const data = await res.json();
        
        if (data.media && data.media.length > 0) {
          const dbMedia = data.media;
          const mergedMedia = existingImages.map((filename) => {
            const existing = dbMedia.find((m: any) => m.filename === filename);
            return {
              id: existing?.id || '',
              url: mediaUrl(filename),
              filename,
              type: existing?.type || (existingImages.indexOf(filename) < 2 ? 'ROOM' : existingImages.indexOf(filename) < 10 ? 'HOTEL' : existingImages.indexOf(filename) < 14 ? 'RESTAURANT' : existingImages.indexOf(filename) < 17 ? 'FACILITY' : 'GALLERY'),
              isActive: existing?.isActive ?? true
            };
          });
          setMediaItems(mergedMedia);
        }
      } catch (err) {
        console.log('Using local media (DB not connected)');
      }
    };
    syncMediaToDatabase();
  }, []);

  const updateMediaInDb = async (id: string, updates: any) => {
    try {
      await fetch(apiPath(`/media/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.log('DB not connected - changes only in memory');
    }
  };

  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [previewMedia, setPreviewMedia] = useState<any>(null);

  const [showAddMedia, setShowAddMedia] = useState(false);

  const [addMediaItems, setAddMediaItems] = useState<any[]>([]);

  const addMediaItem = (item: any) => {
    setAddMediaItems([...addMediaItems, { ...item, id: `new-${Date.now()}-${Math.random()}` }]);
  };

  const removeMediaToAdd = (id: string) => {
    setAddMediaItems(addMediaItems.filter(i => i.id !== id));
  };

  const submitMediaItems = async () => {
    const savedItems: any[] = [];

    for (const item of addMediaItems) {
      try {
        let uploadedUrl = item.url;

        if (item.file instanceof File) {
          const formData = new FormData();
          formData.append('file', item.file);
          formData.append('kind', item.mediaType === 'VIDEO' ? 'file' : 'image');

          const uploadRes = await fetch(apiPath('/upload'), {
            method: 'POST',
            body: formData
          });
          const uploadText = await uploadRes.text();
          let uploadData: any = {};
          try {
            uploadData = uploadText ? JSON.parse(uploadText) : {};
          } catch {
            throw new Error(uploadText.slice(0, 180) || 'Upload returned a non-JSON server response');
          }
          if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
          uploadedUrl = uploadData.url;
        }

        const displayName = String(item.displayName || item.filename).trim();
        const mediaRes = await fetch(apiPath('/media'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: uploadedUrl, filename: displayName, type: item.type })
        });
        const mediaText = await mediaRes.text();
        let mediaData: any = {};
        try {
          mediaData = mediaText ? JSON.parse(mediaText) : {};
        } catch {
          throw new Error(mediaText.slice(0, 180) || 'Media API returned a non-JSON server response');
        }
        if (!mediaRes.ok) throw new Error(mediaData.error || 'Failed to save media');
        savedItems.push(mediaData.media || { ...item, filename: displayName, url: uploadedUrl });
      } catch (error: any) {
        console.error('Media upload failed:', error);
        alert(`Failed to upload ${item.filename}: ${error?.message || 'Please check Supabase Storage.'}`);
      }
    }
    
    setMediaItems([...mediaItems, ...savedItems]);
    setAddMediaItems([]);
    setShowAddMedia(false);
  };

  const deleteMediaItem = async (id: string) => {
    setMediaItems(mediaItems.filter(i => i.id !== id));
    try {
      await fetch(apiPath(`/media/${id}`), { method: 'DELETE' });
    } catch (err) {}
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const deleteSelectedMedia = async () => {
    const toDelete = mediaItems.filter(i => selectedMedia.includes(i.id));
    for (const item of toDelete) {
      if (item.id) {
        try {
          await fetch(apiPath(`/media/${item.id}`), { method: 'DELETE' });
        } catch (err) {}
      }
    }
    setMediaItems(mediaItems.filter(i => !selectedMedia.includes(i.id)));
    setSelectedMedia([]);
    setShowDeleteConfirm(false);
  };

  const toggleMediaSelect = (id: string) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter(i => i !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const selectAllMedia = () => {
    if (selectedMedia.length === mediaItems.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia(mediaItems.map(m => m.id));
    }
  };

  const [editItem, setEditItem] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemType, setItemType] = useState('');

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await fetch(apiPath('/rooms?includeAll=true'));
        const data = await res.json();
        if (!res.ok) throw new Error();
        if (Array.isArray(data.rooms)) {
          setAdminRooms(data.rooms.map((room: any) => ({
            id: String(room.id),
            roomNumber: String(room.roomNumber || room.id),
            name: room.name || room.type,
            type: room.type,
            price: Number(room.price),
            status: room.status === 'AVAILABLE' ? 'Available' : room.status,
            availability: room.status || (room.available ? 'AVAILABLE' : 'MAINTENANCE'),
            maxGuests: Number(room.maxGuests || 2),
            amenities: room.amenities || [],
            imageUrl: room.imageUrl || mediaUrl('image_001.jpg')
          })));
          return;
        }
      } catch (error) {}
      
      // Fallback demo data
      setAdminRooms([
        { id: 'c1', roomNumber: '101', name: 'Classic Single', type: 'SINGLE', price: 89, status: 'Available', availability: 'AVAILABLE', maxGuests: 1, amenities: ['WiFi', 'TV'], imageUrl: mediaUrl('image_001.jpg') },
        { id: 'c2', roomNumber: '102', name: 'Superior Double', type: 'DOUBLE', price: 129, status: 'Available', availability: 'AVAILABLE', maxGuests: 2, amenities: ['WiFi', 'TV', 'Mini Bar'], imageUrl: mediaUrl('image_005.jpg') },
        { id: 'c3', roomNumber: '103', name: 'Deluxe Twin', type: 'TWIN', price: 149, status: 'Occupied', availability: 'OCCUPIED', maxGuests: 2, amenities: ['WiFi', 'TV', 'AC'], imageUrl: mediaUrl('image_006.jpg') },
        { id: 'c4', roomNumber: '104', name: 'Family Suite', type: 'FAMILY', price: 199, status: 'Available', availability: 'AVAILABLE', maxGuests: 4, amenities: ['WiFi', 'TV', 'Mini Bar', 'Room Service'], imageUrl: mediaUrl('image_007.jpg') },
        { id: 'c5', roomNumber: '105', name: 'Royal Suite', type: 'SUITE', price: 349, status: 'Reserved', availability: 'RESERVED', maxGuests: 3, amenities: ['WiFi', 'TV', 'Mini Bar', 'Balcony'], imageUrl: mediaUrl('image_008.jpg') },
        { id: 'c6', roomNumber: '106', name: 'Executive Double', type: 'DOUBLE', price: 159, status: 'Available', availability: 'AVAILABLE', maxGuests: 2, amenities: ['WiFi', 'TV', 'Work Desk'], imageUrl: mediaUrl('image_011.jpg') },
      ]);
    };
    loadRooms();
  }, []);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [reservationsData, tasksData, staffData, housekeepingData, inventoryData, paymentsData, usersData] = await Promise.all([
          fetch(apiPath('/reservations')).then(r => r.json()).catch(() => ({reservations:[]})),
          fetch(apiPath('/tasks')).then(r => r.json()).catch(() => ({tasks:[]})),
          fetch(apiPath('/staff')).then(r => r.json()).catch(() => ({staff:[]})),
          fetch(apiPath('/housekeeping')).then(r => r.json()).catch(() => ({tasks:[]})),
          fetch(apiPath('/inventory')).then(r => r.json()).catch(() => ({items:[]})),
          fetch(apiPath('/payments')).then(r => r.json()).catch(() => ({payments:[]})),
          fetch(apiPath('/users')).then(r => r.json()).catch(() => ({users:[]}))
        ]);

        if (Array.isArray(reservationsData?.reservations) && reservationsData.reservations.length > 0) {
          setReservations(reservationsData.reservations.map((reservation: any) => ({
            id: String(reservation.id),
            guestName: reservation.guestName || 'Guest',
            guestEmail: reservation.guestEmail || '',
            roomNumber: reservation.roomNumber || reservation.roomId || '',
            checkIn: reservation.checkIn,
            checkOut: reservation.checkOut,
            status: reservation.status || 'PENDING',
            totalPrice: Number(reservation.totalPrice || 0)
          })));
        } else {
          // Demo reservations
          setReservations([
            { id: 'r1', guestName: 'John Smith', guestEmail: 'john@email.com', roomNumber: '103', checkIn: '2026-05-15', checkOut: '2026-05-18', status: 'CONFIRMED', totalPrice: 447 },
            { id: 'r2', guestName: 'Marie Dupont', guestEmail: 'marie@email.com', roomNumber: '105', checkIn: '2026-05-20', checkOut: '2026-05-25', status: 'PENDING', totalPrice: 1745 },
            { id: 'r3', guestName: 'Hans Mueller', guestEmail: 'hans@email.com', roomNumber: '102', checkIn: '2026-05-10', checkOut: '2026-05-12', status: 'COMPLETED', totalPrice: 258 },
          ]);
        }
        
        setStaffList(Array.isArray(staffData?.staff) && staffData.staff.length > 0 ? staffData.staff : [
          { id: 's1', name: 'Marie Dubois', email: 'marie@citadel.com', role: 'Manager', department: 'Administration', status: 'ACTIVE' },
          { id: 's2', name: 'Jean Martin', email: 'jean@citadel.com', role: 'Receptionist', department: 'Front Desk', status: 'ACTIVE' },
          { id: 's3', name: 'Sophie Bernard', email: 'sophie@citadel.com', role: 'Housekeeping', department: 'Cleaning', status: 'ACTIVE' },
        ]);
        
        setHousekeepingTasks(Array.isArray(housekeepingData?.tasks) ? housekeepingData.tasks : [
          { id: 'h1', roomNumber: '101', type: 'CLEANING', status: 'COMPLETED', priority: 'HIGH', createdAt: '2026-05-10' },
          { id: 'h2', roomNumber: '103', type: 'TURNDOWN_SERVICE', status: 'IN_PROGRESS', priority: 'MEDIUM', createdAt: '2026-05-15' },
        ]);
        
        setInventoryItems(Array.isArray(inventoryData?.items) ? inventoryData.items : [
          { id: 'i1', name: 'Towels', category: 'Linens', quantity: 85, minStock: 20, status: 'OK' },
          { id: 'i2', name: 'Shampoo', category: 'Toiletries', quantity: 45, minStock: 15, status: 'LOW_STOCK' },
        ]);
        
        setPayments(Array.isArray(paymentsData?.payments) ? paymentsData.payments : []);
        setUsers(Array.isArray(usersData?.users) ? usersData.users : []);
      } catch (error) {
        // All demo data already set above
      }
    };
    loadAdminData();
  }, []);

  // Calculate stats from real data
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIns = reservations.filter(r => {
      const checkInDate = new Date(r.checkIn);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime();
    }).length;

    const todayCheckOuts = reservations.filter(r => {
      const checkOutDate = new Date(r.checkOut);
      checkOutDate.setHours(0, 0, 0, 0);
      return checkOutDate.getTime() === today.getTime();
    }).length;

    const pendingPaymentCount = payments.filter(p => p.status === 'PENDING').length;

    setStats({
      totalRooms: adminRooms.length,
      availableRooms: adminRooms.filter(r => r.availability === 'AVAILABLE').length,
      todayCheckIns,
      todayCheckOuts,
      totalReservations: reservations.length,
      pendingPayments: pendingPaymentCount
    });
  }, [reservations, adminRooms, payments]);

  const addRoom = async (room: AdminRoom) => {
    try {
      const res = await fetch(apiPath('/rooms'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: room.roomNumber || room.id,
          name: room.name,
          type: room.type,
          price: room.price,
          maxGuests: room.maxGuests || 2,
          description: `${room.name} at Citadel Hôtel`,
          amenities: room.amenities || [],
          images: room.imageUrl ? [room.imageUrl] : []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create room');
      const created = data.room;
      setAdminRooms([...adminRooms, {
        ...room,
        id: String(created.id),
        roomNumber: created.roomNumber || room.roomNumber,
        imageUrl: created.imageUrl || room.imageUrl
      }]);
      setShowAddRoom(false);
    } catch (error) {
      console.error('Create room failed:', error);
      alert('Failed to save room to database. Please check Supabase connection.');
    }
  };

  const addTask = async (task: { id: string; type: string; status: string; roomNumber: string; reservation: { user: { firstName: string; lastName: string } }; createdAt: string }) => {
    try {
      const res = await fetch(apiPath('/tasks'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create task');
      setTasks([...tasks, data.task]);
      setShowAddTask(false);
    } catch (error) {
      console.error('Create task failed:', error);
      alert('Failed to save task to Supabase.');
    }
  };

  const addStaff = async (staff: any) => {
    try {
      const res = await fetch(apiPath('/staff'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff');
      setStaffList([...staffList, data.staff]);
      setShowAddStaff(false);
    } catch (error) {
      console.error('Create staff failed:', error);
      alert('Failed to save staff to Supabase.');
    }
  };

  const updateStaff = async (staff: any) => {
    try {
      const res = await fetch(apiPath('/staff'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staff)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update staff');
      setStaffList(staffList.map(s => s.id === staff.id ? data.staff : s));
      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Update staff failed:', error);
      alert('Failed to update staff in Supabase.');
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const res = await fetch(apiPath(`/staff?id=${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete staff');
      setStaffList(staffList.filter(s => s.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete staff failed:', error);
      alert('Failed to delete staff from Supabase.');
    }
  };

  const addHousekeepingTask = async (task: any) => {
    try {
      const res = await fetch(apiPath('/housekeeping'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create housekeeping task');
      setHousekeepingTasks([...housekeepingTasks, data.task]);
      setShowAddHousekeeping(false);
    } catch (error) {
      console.error('Create housekeeping task failed:', error);
      alert('Failed to save housekeeping task to Supabase.');
    }
  };

  const updateHousekeepingTask = async (task: any) => {
    try {
      const res = await fetch(apiPath('/housekeeping'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update housekeeping task');
      setHousekeepingTasks(housekeepingTasks.map(t => t.id === task.id ? data.task : t));
      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Update housekeeping task failed:', error);
      alert('Failed to update housekeeping task in Supabase.');
    }
  };

  const deleteHousekeepingTask = async (id: string) => {
    try {
      const res = await fetch(apiPath(`/housekeeping?id=${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete housekeeping task');
      setHousekeepingTasks(housekeepingTasks.filter(t => t.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete housekeeping task failed:', error);
      alert('Failed to delete housekeeping task from Supabase.');
    }
  };

  const addInventoryItem = async (item: any) => {
    try {
      const res = await fetch(apiPath('/inventory'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create inventory item');
      setInventoryItems([...inventoryItems, data.item]);
      setShowAddInventory(false);
    } catch (error) {
      console.error('Create inventory item failed:', error);
      alert('Failed to save inventory item to Supabase.');
    }
  };

  const updateInventoryItem = async (item: any) => {
    try {
      const res = await fetch(apiPath('/inventory'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update inventory item');
      setInventoryItems(inventoryItems.map(i => i.id === item.id ? data.item : i));
      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Update inventory item failed:', error);
      alert('Failed to update inventory item in Supabase.');
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const res = await fetch(apiPath(`/inventory?id=${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inventory item');
      setInventoryItems(inventoryItems.filter(i => i.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete inventory item failed:', error);
      alert('Failed to delete inventory item from Supabase.');
    }
  };

  const addSeasonalRate = (rate: any) => {
    setSeasonalRates([...seasonalRates, { ...rate, id: String(seasonalRates.length + 1) }]);
    setShowAddSeason(false);
  };

  const updateSeasonalRate = (rate: any) => {
    setSeasonalRates(seasonalRates.map(r => r.id === rate.id ? rate : r));
    setShowEditModal(false);
    setEditItem(null);
  };

  const deleteSeasonalRate = (id: string) => {
    setSeasonalRates(seasonalRates.filter(r => r.id !== id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const updateRoom = async (room: AdminRoom) => {
    try {
      const res = await fetch(apiPath('/rooms'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: room.id,
          name: room.name,
          type: room.type,
          price: room.price,
          maxGuests: room.maxGuests || 2,
          status: room.availability || 'AVAILABLE',
          images: room.imageUrl ? [room.imageUrl] : [],
          amenities: room.amenities || []
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update room');
      setAdminRooms(adminRooms.map(r => r.id === room.id ? room : r));
      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Update room failed:', error);
      alert('Failed to update room in database.');
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      const res = await fetch(apiPath(`/rooms?id=${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete room');
      }
      setAdminRooms(adminRooms.filter(r => r.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete room failed:', error);
      alert('Failed to delete room from database.');
    }
  };

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddHousekeeping, setShowAddHousekeeping] = useState(false);
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showAddSeason, setShowAddSeason] = useState(false);
  const [showAddReservation, setShowAddReservation] = useState(false);

  const addReservation = async (reservation: any) => {
    try {
      const res = await fetch(apiPath('/reservations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create reservation');
      setReservations([...reservations, data.reservation]);
      setShowAddReservation(false);
    } catch (error) {
      console.error('Create reservation failed:', error);
      alert('Failed to save reservation to Supabase.');
    }
  };

  const updateReservation = async (reservation: any) => {
    try {
      const res = await fetch(apiPath('/reservations'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update reservation');
      setReservations(reservations.map(r => r.id === reservation.id ? data.reservation : r));
      setShowEditModal(false);
      setEditItem(null);
    } catch (error) {
      console.error('Update reservation failed:', error);
      alert('Failed to update reservation in Supabase.');
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const res = await fetch(apiPath(`/reservations?id=${encodeURIComponent(id)}`), { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete reservation');
      setReservations(reservations.filter(r => r.id !== id));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Delete reservation failed:', error);
      alert('Failed to delete reservation from Supabase.');
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleFileSelection = (files: FileList) => {
    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onload = (e) => {
        setAddMediaItems(prev => [...prev, { 
          id: `new-${Date.now()}-${Math.random()}`, 
          url: e.target?.result as string, 
          file,
          filename: file.name, 
          mediaType: isVideo ? 'VIDEO' : 'IMAGE',
          type: isVideo ? 'GALLERY' : 'HOTEL', 
          isActive: true 
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const handleFileAdded = (e: CustomEvent) => {
      const { url, filename } = e.detail;
      setAddMediaItems(prev => [...prev, { 
        id: `new-${Date.now()}-${Math.random()}`, 
        url, 
        filename, 
        type: 'HOTEL', 
        isActive: true 
      }]);
    };
    window.addEventListener('fileAdded', handleFileAdded as EventListener);
    return () => window.removeEventListener('fileAdded', handleFileAdded as EventListener);
  }, []);

  const handleCheckIn = (reservationId: string) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: 'ACTIVE' } : r
    ));
  };

  const handleCheckOut = (reservationId: string) => {
    setReservations(prev => prev.map(r => 
      r.id === reservationId ? { ...r, status: 'COMPLETED' } : r
    ));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'tasks', label: 'Card Tasks', icon: Key },
    { id: 'housekeeping', label: 'Housekeeping', icon: Sparkles },
    { id: 'staff', label: 'Staff Management', icon: Shirt },
    { id: 'inventory', label: 'Room Service', icon: Package },
    { id: 'houseguests', label: 'In-House Guests', icon: UserCheck },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'pricing', label: 'Pricing', icon: Banknote },
    { id: 'channel', label: 'Channel Manager', icon: Link2 },
    { id: 'guests', label: 'Guests', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const activeMenuItem = menuItems.find(item => item.id === activeTab);
  const ActiveIcon = activeMenuItem?.icon || LayoutDashboard;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'CONFIRMED': return 'bg-blue-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-gray-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PROCESSING': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-[#0d0d0d] border-r border-white/10 flex flex-col overflow-hidden z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-white/10 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-2 bg-white rounded-full p-2">
            <Image
              src="/logo/gold_logo.png"
              alt="Citadel Hôtel"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-display text-base font-semibold text-white">Citadel Hôtel</span>
          <p className="text-xs text-white/50">Admin Dashboard</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors ${
                    activeTab === item.id
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-2 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-[var(--radius-md)] text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 bg-white min-h-screen">
        <header className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
              <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-100 rounded-lg flex-shrink-0">
                <ActiveIcon className="w-5 h-5 text-[#867050]" />
                <span className="font-medium text-gray-700 hidden md:inline">{activeMenuItem?.label}</span>
              </div>
              <div className="relative flex-1 max-w-xs md:max-w-md">
                <Search className="w-4 md:w-5 h-4 md:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#867050]/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 px-2 md:px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <span className="text-sm hidden sm:inline">{languages.find(l => l.code === adminLang)?.flag}</span>
              </button>
              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setAdminLang(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                        adminLang === lang.code ? 'bg-gray-50 text-[#867050]' : 'text-gray-700'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#867050] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">admin@citadelhotel.fr</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-[var(--secondary)]">Welcome back! Here&apos;s your hotel overview.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Total Rooms</span>
                    <Bed className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalRooms}</p>
                  <p className="text-sm text-[var(--success)] mt-1">{stats.availableRooms} available</p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Today&apos;s Activity</span>
                    <Calendar className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.todayCheckIns + stats.todayCheckOuts}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">
                    {stats.todayCheckIns} check-ins, {stats.todayCheckOuts} check-outs
                  </p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Reservations</span>
                    <Users className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.totalReservations}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">This month</p>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[var(--secondary)]">Pending Payments</span>
                    <CreditCard className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                  <p className="text-sm text-[var(--warning)] mt-1">Requires attention</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)]">
                  <div className="p-6 border-b border-[var(--border-light)]">
                    <h2 className="font-semibold text-lg">Recent Reservations</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {reservations.slice(0, 5).map((res) => (
                      <div key={res.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{res.guestName}</p>
                          <p className="text-sm text-[var(--secondary)]">Room {res.roomNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                          <p className="text-sm text-[var(--secondary)] mt-1">
                            â‚¬{res.totalPrice}
                          </p>
                        </div>
                      </div>
                    ))}
                    {reservations.length === 0 && (
                      <p className="text-center text-[var(--secondary)] py-4">No reservations yet</p>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)]">
                  <div className="p-6 border-b border-[var(--border-light)]">
                    <h2 className="font-semibold text-lg">Pending Card Tasks</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {tasks.filter(t => t.status === 'PENDING' || t.status === 'PROCESSING').slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-[var(--primary)]" />
                          <div>
                            <p className="font-medium">Room {task.roomNumber}</p>
                            <p className="text-sm text-[var(--secondary)]">
                              {task.reservation?.user?.firstName} {task.reservation?.user?.lastName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTaskStatusIcon(task.status)}
                          <span className="text-sm">{task.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    ))}
                    {tasks.filter(t => t.status === 'PENDING').length === 0 && (
                      <p className="text-center text-[var(--secondary)] py-4">No pending tasks</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Reservations</h1>
                  <p className="text-[var(--secondary)]">Manage all hotel reservations</p>
                </div>
                <button onClick={() => { setItemType('reservation'); setShowAddReservation(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Reservation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'CONFIRMED').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Confirmed</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'ACTIVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checked In</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{reservations.filter(r => r.status === 'PENDING').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Pending</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Check-in</th>
                      <th className="text-left p-4 font-medium text-sm">Check-out</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Amount</th>
                      <th className="text-left p-4 font-medium text-sm">Check In/Out</th>
                      <th className="text-left p-4 font-medium text-sm"></th>
                      <th className="text-left p-4 font-medium text-sm"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{res.id}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{res.guestName}</p>
                          <p className="text-sm text-[var(--secondary)]">{res.guestEmail}</p>
                        </td>
                        <td className="p-4">{res.roomNumber}</td>
                        <td className="p-4">{new Date(res.checkIn).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(res.checkOut).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getStatusColor(res.status)}`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4">â‚¬{res.totalPrice}</td>
                        <td className="p-4">
                          {res.status === 'CONFIRMED' && (
                            <button onClick={() => handleCheckIn(res.id)} className="text-xs bg-green-500 text-white px-2.5 py-1.5 rounded-md hover:bg-green-600 font-medium">Check In</button>
                          )}
                          {res.status === 'ACTIVE' && (
                            <button onClick={() => handleCheckOut(res.id)} className="text-xs bg-amber-500 text-white px-2.5 py-1.5 rounded-md hover:bg-amber-600 font-medium">Check Out</button>
                          )}
                          {res.status === 'COMPLETED' && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md font-medium">Done</span>}
                          {res.status === 'CANCELLED' && <span className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-medium">X</span>}
                          {res.status === 'PENDING' && <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md font-medium">Wait</span>}
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('reservation'); setEditItem(res); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('reservation'); setDeleteId(res.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Card Tasks</h1>
                  <p className="text-[var(--secondary)]">Manage access card operations</p>
                </div>
                <button 
                  onClick={() => setShowAddTask(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Card Task
                </button>
              </div>

              {showAddTask && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="font-display text-xl mb-4">Add New Card Task</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const firstName = (form.elements.namedItem('guestFirstName') as HTMLInputElement).value;
                      const lastName = (form.elements.namedItem('guestLastName') as HTMLInputElement).value;
                      addTask({
                        id: 'TASK-' + String(tasks.length + 1).padStart(3, '0'),
                        type: (form.elements.namedItem('taskType') as HTMLSelectElement).value,
                        status: 'PENDING',
                        roomNumber: (form.elements.namedItem('taskRoom') as HTMLInputElement).value,
                        reservation: { user: { firstName, lastName } },
                        createdAt: new Date().toISOString()
                      });
                    }}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-1">Task Type</label>
                          <select name="taskType" required className="w-full px-3 py-2 border rounded">
                            <option value="CREATE_CARD">Create Card</option>
                            <option value="DELETE_CARD">Delete Card</option>
                            <option value="RENEW_CARD">Renew Card</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Room Number</label>
                          <input name="taskRoom" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 101" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Guest First Name</label>
                          <input name="guestFirstName" required className="w-full px-3 py-2 border rounded" placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Guest Last Name</label>
                          <input name="guestLastName" required className="w-full px-3 py-2 border rounded" placeholder="Doe" />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowAddTask(false)} className="px-4 py-2 border rounded">Cancel</button>
                          <button type="submit" className="btn-primary">Add Task</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'PENDING').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Failed</span>
                  </div>
                  <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'FAILED').length}</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Task</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Created</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4">
                          <span className="text-sm font-mono text-[var(--secondary)]">{task.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-2">
                            <Key className="w-4 h-4 text-[var(--primary)]" />
                            {task.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          {task.reservation?.user?.firstName} {task.reservation?.user?.lastName}
                        </td>
                        <td className="p-4">{task.roomNumber}</td>
                        <td className="p-4">{new Date(task.createdAt).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 ${
                            task.status === 'COMPLETED' ? 'text-green-500' :
                            task.status === 'FAILED' ? 'text-red-500' :
                            task.status === 'PROCESSING' ? 'text-yellow-500' :
                            'text-gray-500'
                          }`}>
                            {getTaskStatusIcon(task.status)}
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Rooms & Availability</h1>
                  <p className="text-[var(--secondary)]">Manage rooms, suites, and availability status</p>
                </div>
                <button 
                  onClick={() => setShowAddRoom(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Room
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                      <Bed className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{adminRooms.filter(r => r.availability === 'AVAILABLE').length}</p>
                      <p className="text-sm text-gray-500">Available</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{adminRooms.filter(r => r.availability === 'OCCUPIED').length}</p>
                      <p className="text-sm text-gray-500">Occupied</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{adminRooms.filter(r => r.availability === 'MAINTENANCE').length}</p>
                      <p className="text-sm text-gray-500">Maintenance</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{adminRooms.filter(r => r.availability === 'RESERVED').length}</p>
                      <p className="text-sm text-gray-500">Reserved</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <select 
                      value={roomFilter}
                      onChange={(e) => setRoomFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="RESERVED">Reserved</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Type:</span>
                    <select 
                      value={roomTypeFilter}
                      onChange={(e) => setRoomTypeFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="ALL">All Types</option>
                      <option value="SINGLE">Single</option>
                      <option value="DOUBLE">Double</option>
                      <option value="TWIN">Twin</option>
                      <option value="FAMILY">Family</option>
                      <option value="SUITE">Suite</option>
                      <option value="PENTHOUSE">Penthouse</option>
                    </select>
                  </div>
                </div>
              </div>

              {showAddRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                    <h3 className="font-display text-xl mb-4">Add New Room / Suite / Place</h3>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const selectedImage = (form.elements.namedItem('roomImage') as HTMLSelectElement).value;
                      const roomType = (form.elements.namedItem('roomType') as HTMLSelectElement).value;
                      addRoom({
                        id: (form.elements.namedItem('roomId') as HTMLInputElement).value,
                        roomNumber: (form.elements.namedItem('roomId') as HTMLInputElement).value,
                        name: (form.elements.namedItem('roomName') as HTMLInputElement).value || roomType + ' Room',
                        type: roomType,
                        price: parseInt((form.elements.namedItem('roomPrice') as HTMLInputElement).value),
                        status: 'Available',
                        availability: 'AVAILABLE',
                        floor: parseInt((form.elements.namedItem('roomFloor') as HTMLInputElement).value) || 1,
                        maxGuests: parseInt((form.elements.namedItem('roomGuests') as HTMLInputElement).value) || 2,
                        amenities: (form.elements.namedItem('roomAmenities') as HTMLInputElement).value.split(',').map(a => a.trim()).filter(a => a),
                        imageUrl: selectedImage || mediaUrl('image_001.jpg')
                      });
                    }}>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">Room Number</label>
                            <input name="roomId" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 201" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Floor</label>
                            <input name="roomFloor" type="number" defaultValue={1} className="w-full px-3 py-2 border rounded" placeholder="e.g. 2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Room Name</label>
                          <input name="roomName" className="w-full px-3 py-2 border rounded" placeholder="e.g. Deluxe Suite" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Type</label>
                          <select name="roomType" required className="w-full px-3 py-2 border rounded">
                            <option value="SINGLE">Single Room</option>
                            <option value="DOUBLE">Double Room</option>
                            <option value="TWIN">Twin Room</option>
                            <option value="FAMILY">Family Room</option>
                            <option value="SUITE">Suite</option>
                            <option value="PENTHOUSE">Penthouse</option>
                            <option value="VILLA">Villa</option>
                            <option value="BUNGALOW">Bungalow</option>
                            <option value="COTTAGE">Cottage</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm mb-1">Price per night (â‚¬)</label>
                            <input name="roomPrice" type="number" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 150" />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Max Guests</label>
                            <input name="roomGuests" type="number" defaultValue={2} className="w-full px-3 py-2 border rounded" placeholder="e.g. 2" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Amenities (comma separated)</label>
                          <input name="roomAmenities" className="w-full px-3 py-2 border rounded" placeholder="e.g. WiFi, AC, Mini Bar" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Select Image</label>
                          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                            {mediaItems.filter(m => m.type === 'ROOM' || m.type === 'HOTEL').map((media) => (
                              <label key={media.id} className="cursor-pointer relative group">
                                <input 
                                  type="radio" 
                                  name="roomImage" 
                                  value={media.url}
                                  className="sr-only"
                                />
                                <img 
                                  src={media.url} 
                                  alt={media.filename}
                                  className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-[#867050] peer-checked:border-[#867050]" 
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button type="button" onClick={() => setShowAddRoom(false)} className="px-4 py-2 border rounded">Cancel</button>
                          <button type="submit" className="btn-primary">Add Room</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminRooms
                  .filter(r => roomFilter === 'ALL' || r.availability === roomFilter)
                  .filter(r => roomTypeFilter === 'ALL' || r.type === roomTypeFilter)
                  .map((room) => (
                  <div key={room.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-40">
                      <Image
                        src={room.imageUrl || mediaUrl('image_001.jpg')}
                        alt={`Room ${room.id}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button onClick={() => { setItemType('room'); setEditItem(room); setShowEditModal(true); }} className="p-2 bg-white/90 rounded-full hover:bg-white">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setItemType('room'); setDeleteId(room.id); setShowDeleteConfirm(true); }}
                          className="p-2 bg-white/90 rounded-full hover:bg-white text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className={`absolute bottom-2 left-2 px-2.5 py-1.5 rounded-md text-xs font-semibold ${
                        room.availability === 'AVAILABLE' ? 'bg-green-500 text-white' :
                        room.availability === 'OCCUPIED' ? 'bg-blue-500 text-white' :
                        room.availability === 'MAINTENANCE' ? 'bg-orange-500 text-white' :
                        'bg-purple-500 text-white'
                      }`}>
                        {room.availability === 'AVAILABLE' ? 'Available' :
                         room.availability === 'OCCUPIED' ? 'Occupied' :
                         room.availability === 'MAINTENANCE' ? 'Maintenance' : 'Reserved'}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">Room {room.roomNumber}</h3>
                          <p className="text-xs text-gray-400">Floor {room.floor}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{room.name}</p>
                      <p className="text-lg font-bold text-[#867050] mb-3">â‚¬{room.price} <span className="text-xs font-normal text-gray-400">/night</span></p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          room.type === 'PENTHOUSE' ? 'bg-purple-100 text-purple-700' :
                          room.type === 'SUITE' ? 'bg-amber-100 text-amber-700' :
                          room.type === 'FAMILY' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {room.type}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {room.maxGuests} Guest{room.maxGuests! > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {room.amenities?.slice(0, 3).map((amenity, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-100">
                        <label className="text-xs text-gray-500 block mb-1.5">Quick Status Change</label>
                        <select 
                          value={room.availability || 'AVAILABLE'}
                          onChange={(e) => updateRoomAvailability(room.id, e.target.value as any)}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-0 cursor-pointer ${
                            room.availability === 'AVAILABLE' ? 'bg-green-50 text-green-700' :
                            room.availability === 'OCCUPIED' ? 'bg-blue-50 text-blue-700' :
                            room.availability === 'MAINTENANCE' ? 'bg-orange-50 text-orange-700' :
                            'bg-purple-50 text-purple-700'
                          }`}
                        >
                          <option value="AVAILABLE">✓ Available</option>
                          <option value="OCCUPIED">👤 Occupied</option>
                          <option value="MAINTENANCE">🔧 Maintenance</option>
                          <option value="RESERVED">📅 Reserved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Payments</h1>
                <p className="text-[var(--secondary)]">Manage all payments and transactions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Total Revenue</span>
                  </div>
                  <p className="text-3xl font-bold">â‚¬12,450</p>
                  <p className="text-sm text-green-500 mt-1">+15% this month</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">â‚¬2,340</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">5 transactions</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Completed</span>
                  </div>
                  <p className="text-3xl font-bold">â‚¬45</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">This week</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Reservation</th>
                      <th className="text-left p-4 font-medium text-sm">Method</th>
                      <th className="text-left p-4 font-medium text-sm">Date</th>
                      <th className="text-left p-4 font-medium text-sm">Amount</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? payments.map((payment) => {
                      const reservation = reservations.find(r => r.id === payment.reservationId);
                      return (
                        <tr key={payment.id} className="border-t border-[var(--border-light)]">
                          <td className="p-4">
                            <span className="text-sm font-mono text-[var(--secondary)]">{payment.id}</span>
                          </td>
                          <td className="p-4 font-medium">{reservation?.guestName || 'Unknown'}</td>
                          <td className="p-4">{payment.reservationId}</td>
                          <td className="p-4">{payment.method || 'N/A'}</td>
                          <td className="p-4">{new Date(payment.createdAt).toLocaleDateString()}</td>
                          <td className="p-4">â‚¬{Number(payment.amount).toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              payment.status === 'PAID' || payment.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-[var(--secondary)]">No payments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
                <p className="text-[var(--secondary)]">Manage hotel settings and preferences</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Hotel Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Hotel Name</label>
                      <input type="text" defaultValue="Citadel Hôtel" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Address</label>
                      <input type="text" defaultValue="28 rue Royale, 62100 Calais, France" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Phone</label>
                      <input type="text" defaultValue="+33 3 21 97 00 00" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Email</label>
                      <input type="email" defaultValue="contact@citadelhotel.fr" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Booking Settings</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Check-in Time</label>
                      <input type="time" defaultValue="16:00" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Check-out Time</label>
                      <input type="time" defaultValue="11:30" className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]" />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--secondary)] mb-1">Cancellation Policy</label>
                      <select className="w-full px-4 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)]">
                        <option>Free cancellation (24h before)</option>
                        <option>Free cancellation (48h before)</option>
                        <option>Non-refundable</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)] space-y-4">
                  <h2 className="font-semibold text-lg">Notifications</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Email notifications for new reservations</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>Email notifications for payments</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'guests' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Guests</h1>
                <p className="text-[var(--secondary)]">Manage guest information and history</p>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">ID</th>
                      <th className="text-left p-4 font-medium text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-sm">Email</th>
                      <th className="text-left p-4 font-medium text-sm">Phone</th>
                      <th className="text-left p-4 font-medium text-sm">Stays</th>
                      <th className="text-left p-4 font-medium text-sm">Total Spent</th>
                      <th className="text-left p-4 font-medium text-sm">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'GUEST').length > 0 ? users.filter(u => u.role === 'GUEST').map((guest) => {
                      const guestReservations = reservations.filter(r => r.guestEmail === guest.email);
                      const totalSpent = guestReservations.reduce((sum, r) => sum + r.totalPrice, 0);
                      const lastVisit = guestReservations.length > 0 ? new Date(Math.max(...guestReservations.map(r => new Date(r.checkOut).getTime()))).toLocaleDateString() : 'N/A';
                      return (
                        <tr key={guest.id} className="border-t border-[var(--border-light)]">
                          <td className="p-4">
                            <span className="text-sm font-mono text-[var(--secondary)]">{guest.id}</span>
                          </td>
                          <td className="p-4 font-medium">{guest.firstName} {guest.lastName}</td>
                          <td className="p-4 text-sm text-[var(--secondary)]">{guest.email}</td>
                          <td className="p-4 text-sm">{guest.phone || 'N/A'}</td>
                          <td className="p-4">{guestReservations.length}</td>
                          <td className="p-4">â‚¬{totalSpent.toFixed(2)}</td>
                          <td className="p-4 text-sm text-[var(--secondary)]">{lastVisit}</td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-[var(--secondary)]">No guests found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'housekeeping' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Housekeeping</h1>
                  <p className="text-[var(--secondary)]">Manage room cleaning and maintenance</p>
                </div>
                <button onClick={() => { setItemType('housekeeping'); setShowAddHousekeeping(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Ready</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'COMPLETED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">In Progress</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Maintenance</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'MAINTENANCE_NEEDED').length}</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Pending</span>
                  </div>
                  <p className="text-3xl font-bold">{housekeepingTasks.filter(t => t.status === 'PENDING').length}</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Assigned To</th>
                      <th className="text-left p-4 font-medium text-sm">Priority</th>
                      <th className="text-left p-4 font-medium text-sm">Notes</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {housekeepingTasks.map((task) => (
                      <tr key={task.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">Room {task.roomId}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${
                            task.status === 'COMPLETED' ? 'bg-green-500' :
                            task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                            task.status === 'MAINTENANCE_NEEDED' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">{staffList.find(s => s.id === task.assignedToId)?.firstName || '-'}</td>
                        <td className="p-4">
                          <span className={`text-xs ${task.priority === 'HIGH' ? 'text-red-500 font-medium' : ''}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{task.notes || '-'}</td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('housekeeping'); setEditItem(task); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('housekeeping'); setDeleteId(task.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Staff Management</h1>
                  <p className="text-[var(--secondary)]">Manage hotel staff and schedules</p>
                </div>
                <button onClick={() => { setItemType('staff'); setShowAddStaff(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Staff
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Staff</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.filter(s => s.status === 'ACTIVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">On Duty Today</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{staffList.filter(s => s.status === 'ON_LEAVE').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">On Leave</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Name</th>
                      <th className="text-left p-4 font-medium text-sm">Role</th>
                      <th className="text-left p-4 font-medium text-sm">Department</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Shift</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff) => (
                      <tr key={staff.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{staff.firstName} {staff.lastName}</td>
                        <td className="p-4">{staff.role}</td>
                        <td className="p-4">{staff.department}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            staff.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                            staff.status === 'INACTIVE' ? 'bg-gray-500/10 text-gray-500' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {staff.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{staff.shiftStart && staff.shiftEnd ? `${staff.shiftStart} - ${staff.shiftEnd}` : '-'}</td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('staff'); setEditItem(staff); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('staff'); setDeleteId(staff.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Room Service / Inventory</h1>
                  <p className="text-[var(--secondary)]">Manage minibar, amenities, and room supplies</p>
                </div>
                <button onClick={() => { setItemType('inventory'); setShowAddInventory(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.reduce((sum, i) => sum + i.quantity, 0)}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Items in Stock</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.filter(i => i.quantity < i.minStock).length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Low Stock</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{inventoryItems.filter(i => i.category === 'MINIBAR').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Minibar Items</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Item</th>
                      <th className="text-left p-4 font-medium text-sm">Category</th>
                      <th className="text-left p-4 font-medium text-sm">Stock</th>
                      <th className="text-left p-4 font-medium text-sm">Min Stock</th>
                      <th className="text-left p-4 font-medium text-sm">Price</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Edit</th>
                      <th className="text-left p-4 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryItems.map((item) => (
                      <tr key={item.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{item.name}</td>
                        <td className="p-4">{item.category}</td>
                        <td className="p-4">{item.quantity}</td>
                        <td className="p-4">{item.minStock}</td>
                        <td className="p-4">â‚¬{item.unitPrice}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            item.quantity >= item.minStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {item.quantity >= item.minStock ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('inventory'); setEditItem(item); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-4">
                          <button onClick={() => { setItemType('inventory'); setDeleteId(item.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'houseguests' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">In-House Guests</h1>
                <p className="text-[var(--secondary)]">Manage currently checked-in guests</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">6</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checked In</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Checkouts Today</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">9</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Guests</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Guest</th>
                      <th className="text-left p-4 font-medium text-sm">Room</th>
                      <th className="text-left p-4 font-medium text-sm">Check-in</th>
                      <th className="text-left p-4 font-medium text-sm">Check-out</th>
                      <th className="text-left p-4 font-medium text-sm">Guests</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.filter(r => r.status === 'ACTIVE').length > 0 ? reservations.filter(r => r.status === 'ACTIVE').map((guest) => (
                      <tr key={guest.id} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{guest.guestName}</td>
                        <td className="p-4">Room {guest.roomNumber}</td>
                        <td className="p-4">{new Date(guest.checkIn).toLocaleDateString()}</td>
                        <td className="p-4">{new Date(guest.checkOut).toLocaleDateString()}</td>
                        <td className="p-4">1</td>
                        <td className="p-4">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-500">
                            In House
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-sm text-[var(--primary)] hover:underline mr-3">View</button>
                          <button onClick={() => handleCheckOut(guest.id)} className="text-sm text-[var(--warning)] hover:underline">Checkout</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-[var(--secondary)]">No guests currently checked in</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Reports</h1>
                <p className="text-[var(--secondary)]">View hotel performance analytics</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">â‚¬12,450</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Revenue</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">67%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Occupancy Rate</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">â‚¬89</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Avg. Daily Rate</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">45</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Reservations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold mb-4">Revenue by Month</h3>
                  <div className="space-y-3">
                    {[
                      { month: 'April 2026', amount: 12450 },
                      { month: 'March 2026', amount: 10200 },
                      { month: 'February 2026', amount: 8900 },
                      { month: 'January 2026', amount: 11500 },
                    ].map((item) => (
                      <div key={item.month} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <span className="font-medium">â‚¬{item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <h3 className="font-semibold mb-4">Room Type Performance</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Double Room', revenue: 4200, occupancy: 75 },
                      { type: 'Twin Room', revenue: 3100, occupancy: 65 },
                      { type: 'Family Room', revenue: 2800, occupancy: 60 },
                      { type: 'Suite', revenue: 2350, occupancy: 70 },
                    ].map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <span className="text-sm">{item.type}</span>
                        <div className="text-right">
                          <span className="font-medium">â‚¬{item.revenue}</span>
                          <span className="text-xs text-gray-500 ml-2">({item.occupancy}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

{activeTab === 'pricing' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Pricing & Seasonal Rates</h1>
                  <p className="text-[var(--secondary)]">Manage room rates and seasonal pricing</p>
                </div>
                <button onClick={() => { setItemType('pricing'); setShowAddSeason(true); }} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Season
                </button>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                <h3 className="font-semibold mb-4">Base Room Rates</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Room Type</th>
                      <th className="text-left p-3 font-medium text-sm">Base Price</th>
                      <th className="text-left p-3 font-medium text-sm">Weekend Premium</th>
                      <th className="text-left p-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: 'Single Room', base: 59, weekend: 69 },
                      { type: 'Double Room', base: 79, weekend: 89 },
                      { type: 'Twin Room', base: 89, weekend: 99 },
                      { type: 'Family Room', base: 150, weekend: 180 },
                      { type: 'Suite', base: 200, weekend: 250 },
                    ].map((room) => (
                      <tr key={room.type} className="border-t border-[var(--border-light)]">
                        <td className="p-3">{room.type}</td>
                        <td className="p-3">â‚¬{room.base}</td>
                        <td className="p-3">â‚¬{room.weekend}</td>
                        <td className="p-3">
                          <button className="text-sm text-[var(--primary)] hover:underline">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                <h3 className="font-semibold mb-4">Seasonal Pricing</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-medium text-sm">Season</th>
                      <th className="text-left p-3 font-medium text-sm">Start Date</th>
                      <th className="text-left p-3 font-medium text-sm">End Date</th>
                      <th className="text-left p-3 font-medium text-sm">Multiplier</th>
                      <th className="text-left p-3 font-medium text-sm">Edit</th>
                      <th className="text-left p-3 font-medium text-sm">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonalRates.map((season) => (
                      <tr key={season.id} className="border-t border-[var(--border-light)]">
                        <td className="p-3 font-medium">{season.name}</td>
                        <td className="p-3">{season.startDate}</td>
                        <td className="p-3">{season.endDate}</td>
                        <td className="p-3">
                          <span className="inline-block px-2 py-1 bg-[var(--primary)]/10 rounded text-sm">
                            {season.multiplier}x
                          </span>
                        </td>
                        <td className="p-3">
                          <button onClick={() => { setItemType('pricing'); setEditItem(season); setShowEditModal(true); }} className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-200 font-medium">
                            <Edit className="w-3 h-3 inline mr-1" />Edit
                          </button>
                        </td>
                        <td className="p-3">
                          <button onClick={() => { setItemType('pricing'); setDeleteId(season.id); setShowDeleteConfirm(true); }} className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-200 font-medium">
                            <Trash2 className="w-3 h-3 inline mr-1" />Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Media Library</h1>
                  <p className="text-[var(--secondary)]">Manage hotel images and media files</p>
                </div>
                <div className="flex gap-2">
                  {selectedMedia.length > 0 && (
                    <button onClick={() => { setItemType('media'); setShowDeleteConfirm(true); }} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedMedia.length})
                    </button>
                  )}
                  <button onClick={() => setShowAddMedia(true)} className="btn-primary flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Add Media
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={selectedMedia.length === mediaItems.length && mediaItems.length > 0}
                      onChange={selectAllMedia}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${selectedMedia.length === mediaItems.length && mediaItems.length > 0 ? 'bg-[#867050] border-[#867050]' : 'border-gray-300'}`}>
                      {selectedMedia.length === mediaItems.length && mediaItems.length > 0 && (
                        <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium">Select All</span>
                </label>
                {selectedMedia.length > 0 && (
                  <span className="text-sm text-[var(--secondary)] bg-gray-100 px-2 py-1 rounded">{selectedMedia.length} selected</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Total Images</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.filter(m => m.type === 'ROOM').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Room Images</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <p className="text-3xl font-bold">{mediaItems.filter(m => m.type === 'HOTEL').length}</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">Hotel Images</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaItems.map((media) => (
                  <div key={media.id} className={`relative group rounded-lg overflow-hidden border-2 ${selectedMedia.includes(media.id) ? 'border-[#867050] ring-2 ring-[#867050]/30' : 'border-[var(--border-light)]'}`}>
                    <div className="absolute top-2 left-2 z-10">
                      <div 
                        onClick={() => toggleMediaSelect(media.id)}
                        className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${selectedMedia.includes(media.id) ? 'bg-[#867050] border-[#867050]' : 'border-white/70 bg-white/30'}`}
                      >
                        {selectedMedia.includes(media.id) && (
                          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div onClick={() => setPreviewMedia(media)} className="cursor-pointer">
                      {(media as any).mediaType === 'VIDEO' ? (
                        <video src={media.url} className="w-full h-32 object-cover" />
                      ) : (
                        <img src={media.url} alt={media.filename || 'Media'} className="w-full h-32 object-cover" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setItemType('media'); setEditItem(media); setShowEditModal(true); }} className="bg-amber-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-amber-600">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); setItemType('media'); setDeleteId(media.id); setShowDeleteConfirm(true); }} className="bg-red-500 text-white px-3 py-1.5 rounded-md text-xs hover:bg-red-600">Delete</button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pointer-events-none">
                      <p className="text-white text-xs font-semibold truncate">{media.filename || 'Untitled media'}</p>
                      <p className="text-white/75 text-[10px] truncate">{(media as any).mediaType === 'VIDEO' ? 'VIDEO' : media.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              {mediaItems.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-[var(--secondary)]">No images yet. Click "Add Media" to upload.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'channel' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-3xl font-bold mb-2">Channel Manager</h1>
                <p className="text-[var(--secondary)]">Manage distribution channels and bookings</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Link2 className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Booking.com</span>
                  </div>
                  <p className="text-3xl font-bold">45%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Link2 className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Expedia</span>
                  </div>
                  <p className="text-3xl font-bold">30%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
                <div className="bg-[var(--card)] rounded-[var(--radius-lg)] p-6 border border-[var(--border-light)]">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Direct Website</span>
                  </div>
                  <p className="text-3xl font-bold">25%</p>
                  <p className="text-sm text-[var(--secondary)] mt-1">of bookings</p>
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-[var(--radius-lg)] border border-[var(--border-light)] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="text-left p-4 font-medium text-sm">Channel</th>
                      <th className="text-left p-4 font-medium text-sm">Status</th>
                      <th className="text-left p-4 font-medium text-sm">Rooms Synced</th>
                      <th className="text-left p-4 font-medium text-sm">Last Sync</th>
                      <th className="text-left p-4 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { channel: 'Booking.com', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:30' },
                      { channel: 'Expedia', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:28' },
                      { channel: 'Hotels.com', status: 'Connected', rooms: 15, lastSync: '2026-04-18 14:25' },
                      { channel: 'Direct Website', status: 'Active', rooms: 15, lastSync: '-' },
                    ].map((ch) => (
                      <tr key={ch.channel} className="border-t border-[var(--border-light)]">
                        <td className="p-4 font-medium">{ch.channel}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            ch.status === 'Connected' || ch.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                          }`}>
                            <CheckCircle className="w-3 h-3" />
                            {ch.status}
                          </span>
                        </td>
                        <td className="p-4">{ch.rooms}</td>
                        <td className="p-4 text-sm text-[var(--secondary)]">{ch.lastSync}</td>
                        <td className="p-4">
                          <button className="text-sm text-[var(--primary)] hover:underline mr-3">Sync Now</button>
                          <button className="text-sm text-gray-500 hover:underline">Settings</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddStaff && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add New Staff</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addStaff({
                    firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
                    lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
                    email: (form.elements.namedItem('email') as HTMLInputElement).value,
                    phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                    role: (form.elements.namedItem('role') as HTMLSelectElement).value,
                    department: (form.elements.namedItem('department') as HTMLInputElement).value,
                    status: 'ACTIVE',
                    shiftStart: (form.elements.namedItem('shiftStart') as HTMLInputElement).value,
                    shiftEnd: (form.elements.namedItem('shiftEnd') as HTMLInputElement).value,
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">First Name</label><input name="firstName" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Last Name</label><input name="lastName" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Email</label><input name="email" type="email" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Phone</label><input name="phone" className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Role</label>
                      <select name="role" required className="w-full px-3 py-2 border rounded">
                        <option value="HOUSEKEEPER">Housekeeper</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="CHEF">Chef</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="MANAGER">Manager</option>
                        <option value="BELLBOY">Bellboy</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Department</label><input name="department" required className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2">
                      <div className="flex-1"><label className="block text-sm mb-1">Shift Start</label><input name="shiftStart" type="time" className="w-full px-3 py-2 border rounded" /></div>
                      <div className="flex-1"><label className="block text-sm mb-1">Shift End</label><input name="shiftEnd" type="time" className="w-full px-3 py-2 border rounded" /></div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddStaff(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Staff</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showEditModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Edit {itemType === 'staff' ? 'Staff' : itemType === 'housekeeping' ? 'Housekeeping' : itemType === 'media' ? 'Image' : itemType === 'room' ? 'Room' : 'Item'}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  if (itemType === 'staff') {
                    updateStaff({
                      ...editItem,
                      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
                      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
                      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
                      role: (form.elements.namedItem('role') as HTMLSelectElement).value,
                      department: (form.elements.namedItem('department') as HTMLInputElement).value,
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    });
                  } else if (itemType === 'housekeeping') {
                    updateHousekeepingTask({
                      ...editItem,
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                      priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
                      assignedToId: (form.elements.namedItem('assignedToId') as HTMLSelectElement).value,
                      notes: (form.elements.namedItem('notes') as HTMLInputElement).value,
                    });
                  } else if (itemType === 'inventory') {
                    updateInventoryItem({
                      ...editItem,
                      name: (form.elements.namedItem('name') as HTMLInputElement).value,
                      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
                      quantity: parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value),
                      minStock: parseInt((form.elements.namedItem('minStock') as HTMLInputElement).value),
                      unitPrice: parseFloat((form.elements.namedItem('unitPrice') as HTMLInputElement).value),
                    });
                  } else if (itemType === 'pricing') {
                    updateSeasonalRate({
                      ...editItem,
                      name: (form.elements.namedItem('name') as HTMLInputElement).value,
                      seasonType: (form.elements.namedItem('seasonType') as HTMLSelectElement).value,
                      startDate: (form.elements.namedItem('startDate') as HTMLInputElement).value,
                      endDate: (form.elements.namedItem('endDate') as HTMLInputElement).value,
                      multiplier: parseFloat((form.elements.namedItem('multiplier') as HTMLInputElement).value),
                    });
                  } else if (itemType === 'reservation') {
                    updateReservation({
                      ...editItem,
                      guestName: (form.elements.namedItem('guestName') as HTMLInputElement).value,
                      guestEmail: (form.elements.namedItem('guestEmail') as HTMLInputElement).value,
                      guestPhone: (form.elements.namedItem('guestPhone') as HTMLInputElement).value,
                      roomNumber: (form.elements.namedItem('roomNumber') as HTMLInputElement).value,
                      checkIn: (form.elements.namedItem('checkIn') as HTMLInputElement).value,
                      checkOut: (form.elements.namedItem('checkOut') as HTMLInputElement).value,
                      totalPrice: parseInt((form.elements.namedItem('totalPrice') as HTMLInputElement).value),
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    });
                  } else if (itemType === 'room') {
                    const availability = (form.elements.namedItem('roomStatus') as HTMLSelectElement).value as AdminRoom['availability'];
                    const statusMap: Record<string, string> = {
                      AVAILABLE: 'Available',
                      OCCUPIED: 'Occupied',
                      MAINTENANCE: 'Maintenance',
                      RESERVED: 'Reserved'
                    };
                    void updateRoom({
                      ...editItem,
                      name: (form.elements.namedItem('roomName') as HTMLInputElement).value,
                      type: (form.elements.namedItem('roomType') as HTMLSelectElement).value,
                      price: parseInt((form.elements.namedItem('roomPrice') as HTMLInputElement).value),
                      status: statusMap[availability || 'AVAILABLE'],
                      availability,
                      imageUrl: (form.elements.namedItem('roomImage') as HTMLSelectElement).value || editItem.imageUrl
                    });
                  } else if (itemType === 'media') {
                    const newFilename = (form.elements.namedItem('filename') as HTMLInputElement).value;
                    const newType = (form.elements.namedItem('type') as HTMLSelectElement).value;
                    const updatedMedia = mediaItems.map(item => 
                      item.id === editItem.id 
                        ? { 
                            ...item, 
                            filename: newFilename,
                            type: newType
                          }
                        : item
                    );
                    setMediaItems(updatedMedia);
                    if (editItem.id) {
                      void updateMediaInDb(editItem.id, { filename: newFilename, type: newType });
                    }
                  }
                  setShowEditModal(false);
                  setEditItem(null);
                }}>
                  <div className="space-y-4">
                    {itemType === 'staff' && (
                      <>
                        <div><label className="block text-sm mb-1">First Name</label><input name="firstName" defaultValue={editItem?.firstName} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Last Name</label><input name="lastName" defaultValue={editItem?.lastName} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Phone</label><input name="phone" defaultValue={editItem?.phone} className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Role</label>
                          <select name="role" defaultValue={editItem?.role} required className="w-full px-3 py-2 border rounded">
                            <option value="HOUSEKEEPER">Housekeeper</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="CHEF">Chef</option>
                            <option value="MAINTENANCE">Maintenance</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Department</label><input name="department" defaultValue={editItem?.department} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="ON_LEAVE">On Leave</option>
                          </select>
                        </div>
                      </>
                    )}
                    {itemType === 'housekeeping' && (
                      <>
                        <div><label className="block text-sm mb-1">Room</label><input name="roomId" defaultValue={editItem?.roomId} disabled className="w-full px-3 py-2 border rounded bg-gray-100" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="MAINTENANCE_NEEDED">Maintenance Needed</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Priority</label>
                          <select name="priority" defaultValue={editItem?.priority} required className="w-full px-3 py-2 border rounded">
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="URGENT">Urgent</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Assign To</label>
                          <select name="assignedToId" defaultValue={editItem?.assignedToId || ''} className="w-full px-3 py-2 border rounded">
                            <option value="">Unassigned</option>
                            {staffList.filter(s => s.status === 'ACTIVE').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Notes</label><input name="notes" defaultValue={editItem?.notes} className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'inventory' && (
                      <>
                        <div><label className="block text-sm mb-1">Name</label><input name="name" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Category</label>
                          <select name="category" defaultValue={editItem?.category} required className="w-full px-3 py-2 border rounded">
                            <option value="MINIBAR">Minibar</option>
                            <option value="AMENITIES">Amenities</option>
                            <option value="LINENS">Linens</option>
                            <option value="IN_ROOM_COFFEE">In-Room Coffee</option>
                            <option value="CLEANING_SUPPLIES">Cleaning Supplies</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Quantity</label><input name="quantity" type="number" defaultValue={editItem?.quantity} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Min Stock</label><input name="minStock" type="number" defaultValue={editItem?.minStock} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Unit Price (â‚¬)</label><input name="unitPrice" type="number" step="0.01" defaultValue={editItem?.unitPrice} required className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'pricing' && (
                      <>
                        <div><label className="block text-sm mb-1">Name</label><input name="name" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Season Type</label>
                          <select name="seasonType" defaultValue={editItem?.seasonType} required className="w-full px-3 py-2 border rounded">
                            <option value="LOW_SEASON">Low Season</option>
                            <option value="REGULAR">Regular</option>
                            <option value="HIGH_SEASON">High Season</option>
                            <option value="PEAK_SEASON">Peak Season</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Start Date</label><input name="startDate" type="date" defaultValue={editItem?.startDate} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">End Date</label><input name="endDate" type="date" defaultValue={editItem?.endDate} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Multiplier</label><input name="multiplier" type="number" step="0.1" defaultValue={editItem?.multiplier} required className="w-full px-3 py-2 border rounded" /></div>
                      </>
                    )}
                    {itemType === 'reservation' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Guest Name</label><input name="guestName" defaultValue={editItem?.guestName} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Room</label><input name="roomNumber" defaultValue={editItem?.roomNumber} required className="w-full px-3 py-2 border rounded" /></div>
                        </div>
                        <div><label className="block text-sm mb-1">Email</label><input name="guestEmail" type="email" defaultValue={editItem?.guestEmail} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Phone</label><input name="guestPhone" defaultValue={editItem?.guestPhone} className="w-full px-3 py-2 border rounded" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Check-in</label><input name="checkIn" type="date" defaultValue={editItem?.checkIn} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Check-out</label><input name="checkOut" type="date" defaultValue={editItem?.checkOut} required className="w-full px-3 py-2 border rounded" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-sm mb-1">Total Price (â‚¬)</label><input name="totalPrice" type="number" defaultValue={editItem?.totalPrice} required className="w-full px-3 py-2 border rounded" /></div>
                          <div><label className="block text-sm mb-1">Status</label>
                            <select name="status" defaultValue={editItem?.status} required className="w-full px-3 py-2 border rounded">
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="ACTIVE">Active</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}
                    {itemType === 'room' && (
                      <>
                        <div><label className="block text-sm mb-1">Room Name</label><input name="roomName" defaultValue={editItem?.name} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Type</label>
                          <select name="roomType" defaultValue={editItem?.type} required className="w-full px-3 py-2 border rounded">
                            <option value="SINGLE">Single</option>
                            <option value="DOUBLE">Double</option>
                            <option value="TWIN">Twin</option>
                            <option value="FAMILY">Family</option>
                            <option value="SUITE">Suite</option>
                            <option value="PENTHOUSE">Penthouse</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Price per night (â‚¬)</label><input name="roomPrice" type="number" defaultValue={editItem?.price} required className="w-full px-3 py-2 border rounded" /></div>
                        <div><label className="block text-sm mb-1">Status</label>
                          <select name="roomStatus" defaultValue={editItem?.availability || 'AVAILABLE'} required className="w-full px-3 py-2 border rounded">
                            <option value="AVAILABLE">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="RESERVED">Reserved</option>
                          </select>
                        </div>
                        <div><label className="block text-sm mb-1">Image</label>
                          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded">
                            {mediaItems.filter(m => m.type === 'ROOM' || m.type === 'HOTEL').map((media) => (
                              <label key={media.id} className="cursor-pointer relative group">
                                <input 
                                  type="radio" 
                                  name="roomImage" 
                                  value={media.url}
                                  defaultChecked={editItem?.imageUrl === media.url}
                                  className="sr-only"
                                />
                                <img 
                                  src={media.url} 
                                  alt={media.filename}
                                  className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-[#867050] peer-checked:border-[#867050]" 
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {itemType === 'media' && (
                      <>
                        <div><label className="block text-sm mb-1">Image Name</label>
                          <input name="filename" defaultValue={editItem?.filename} required className="w-full px-3 py-2 border rounded" />
                        </div>
                        <div><label className="block text-sm mb-1">Image Type</label>
                          <select name="type" defaultValue={editItem?.type} required className="w-full px-3 py-2 border rounded">
                            <option value="ROOM">Room</option>
                            <option value="HOTEL">Hotel</option>
                            <option value="RESTAURANT">Restaurant</option>
                            <option value="FACILITY">Facility</option>
                            <option value="GALLERY">Gallery</option>
                          </select>
                        </div>
                      </>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Save</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h3 className="font-display text-xl mb-4">Confirm Delete</h3>
                <p className="text-[var(--secondary)] mb-4">
                  {itemType === 'media' && selectedMedia.length > 0 
                    ? `Are you sure you want to delete ${selectedMedia.length} item(s)? This action cannot be undone.`
                    : `Are you sure you want to delete this ${itemType}? This action cannot be undone.`
                  }
                </p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteId(null); setSelectedMedia([]); }} className="px-4 py-2 border rounded">Cancel</button>
                  <button onClick={() => {
                    if (itemType === 'staff') deleteStaff(deleteId!);
                    else if (itemType === 'housekeeping') deleteHousekeepingTask(deleteId!);
                    else if (itemType === 'inventory') deleteInventoryItem(deleteId!);
                    else if (itemType === 'pricing') deleteSeasonalRate(deleteId!);
                    else if (itemType === 'reservation') deleteReservation(deleteId!);
                    else if (itemType === 'room') deleteRoom(deleteId!);
                    else if (itemType === 'media' && selectedMedia.length > 0) deleteSelectedMedia();
                    else if (itemType === 'media') deleteMediaItem(deleteId!);
                  }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          )}

          {previewMedia && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setPreviewMedia(null)}>
              <button onClick={() => setPreviewMedia(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
                <X className="w-8 h-8" />
              </button>
              {previewMedia.mediaType === 'VIDEO' ? (
                <video 
                  src={previewMedia.url} 
                  controls 
                  autoPlay 
                  className="max-h-[80vh] max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <img 
                  src={previewMedia.url} 
                  alt={previewMedia.filename} 
                  className="max-h-[80vh] max-w-[90vw] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}

          {showAddHousekeeping && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Housekeeping Task</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addHousekeepingTask({
                    roomId: (form.elements.namedItem('roomId') as HTMLInputElement).value,
                    priority: (form.elements.namedItem('priority') as HTMLSelectElement).value,
                    assignedToId: (form.elements.namedItem('assignedToId') as HTMLSelectElement).value || null,
                    notes: (form.elements.namedItem('notes') as HTMLInputElement).value,
                    status: 'PENDING',
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Room Number</label><input name="roomId" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 101" /></div>
                    <div><label className="block text-sm mb-1">Priority</label>
                      <select name="priority" required className="w-full px-3 py-2 border rounded">
                        <option value="LOW">Low</option>
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Assign To</label>
                      <select name="assignedToId" className="w-full px-3 py-2 border rounded">
                        <option value="">Unassigned</option>
                        {staffList.filter(s => s.status === 'ACTIVE').map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Notes</label><input name="notes" className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddHousekeeping(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Task</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddInventory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Inventory Item</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addInventoryItem({
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    category: (form.elements.namedItem('category') as HTMLSelectElement).value,
                    quantity: parseInt((form.elements.namedItem('quantity') as HTMLInputElement).value),
                    minStock: parseInt((form.elements.namedItem('minStock') as HTMLInputElement).value),
                    unitPrice: parseFloat((form.elements.namedItem('unitPrice') as HTMLInputElement).value),
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Item Name</label><input name="name" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Category</label>
                      <select name="category" required className="w-full px-3 py-2 border rounded">
                        <option value="MINIBAR">Minibar</option>
                        <option value="AMENITIES">Amenities</option>
                        <option value="LINENS">Linens</option>
                        <option value="IN_ROOM_COFFEE">In-Room Coffee</option>
                        <option value="CLEANING_SUPPLIES">Cleaning Supplies</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Quantity</label><input name="quantity" type="number" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Min Stock</label><input name="minStock" type="number" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Unit Price (â‚¬)</label><input name="unitPrice" type="number" step="0.01" required className="w-full px-3 py-2 border rounded" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddInventory(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Item</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddSeason && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-display text-xl mb-4">Add Seasonal Rate</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  addSeasonalRate({
                    name: (form.elements.namedItem('name') as HTMLInputElement).value,
                    seasonType: (form.elements.namedItem('seasonType') as HTMLSelectElement).value,
                    startDate: (form.elements.namedItem('startDate') as HTMLInputElement).value,
                    endDate: (form.elements.namedItem('endDate') as HTMLInputElement).value,
                    multiplier: parseFloat((form.elements.namedItem('multiplier') as HTMLInputElement).value),
                    isActive: true,
                  });
                }}>
                  <div className="space-y-4">
                    <div><label className="block text-sm mb-1">Name</label><input name="name" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Season Type</label>
                      <select name="seasonType" required className="w-full px-3 py-2 border rounded">
                        <option value="LOW_SEASON">Low Season</option>
                        <option value="REGULAR">Regular</option>
                        <option value="HIGH_SEASON">High Season</option>
                        <option value="PEAK_SEASON">Peak Season</option>
                      </select>
                    </div>
                    <div><label className="block text-sm mb-1">Start Date</label><input name="startDate" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">End Date</label><input name="endDate" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Multiplier</label><input name="multiplier" type="number" step="0.1" required className="w-full px-3 py-2 border rounded" placeholder="e.g. 1.5" /></div>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddSeason(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Add Season</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddReservation && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h3 className="font-display text-xl mb-4">Add New Reservation (Phone/Call)</h3>
                <p className="text-sm text-[var(--secondary)] mb-4">Create reservation for client calling by phone</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const checkIn = new Date((form.elements.namedItem('checkIn') as HTMLInputElement).value);
                  const checkOut = new Date((form.elements.namedItem('checkOut') as HTMLInputElement).value);
                  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
                  const pricePerNight = parseInt((form.elements.namedItem('pricePerNight') as HTMLInputElement).value);
                  const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value;
                  const lastName = (form.elements.namedItem('lastName') as HTMLInputElement).value;
                  addReservation({
                    guestName: firstName + ' ' + lastName,
                    guestEmail: (form.elements.namedItem('guestEmail') as HTMLInputElement).value,
                    guestPhone: (form.elements.namedItem('guestPhone') as HTMLInputElement).value,
                    roomNumber: (form.elements.namedItem('roomNumber') as HTMLInputElement).value,
                    checkIn: (form.elements.namedItem('checkIn') as HTMLInputElement).value,
                    checkOut: (form.elements.namedItem('checkOut') as HTMLInputElement).value,
                    totalPrice: nights * pricePerNight,
                    status: 'CONFIRMED',
                  });
                }}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Guest First Name</label><input name="firstName" required className="w-full px-3 py-2 border rounded" placeholder="John" /></div>
                      <div><label className="block text-sm mb-1">Guest Last Name</label><input name="lastName" required className="w-full px-3 py-2 border rounded" placeholder="Doe" /></div>
                    </div>
                    <div><label className="block text-sm mb-1">Email</label><input name="guestEmail" type="email" required className="w-full px-3 py-2 border rounded" placeholder="john@example.com" /></div>
                    <div><label className="block text-sm mb-1">Phone</label><input name="guestPhone" type="tel" required className="w-full px-3 py-2 border rounded" placeholder="+33 6 12 34 56 78" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Room Number</label>
                        <select name="roomNumber" required className="w-full px-3 py-2 border rounded">
                          <option value="">Select Room</option>
                          {adminRooms.map(r => <option key={r.id} value={r.id}>Room {r.id} - {r.name}</option>)}
                        </select>
                      </div>
                      <div><label className="block text-sm mb-1">Price per Night (â‚¬)</label><input name="pricePerNight" type="number" required className="w-full px-3 py-2 border rounded" placeholder="79" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm mb-1">Check-in Date</label><input name="checkIn" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                      <div><label className="block text-sm mb-1">Check-out Date</label><input name="checkOut" type="date" required className="w-full px-3 py-2 border rounded" /></div>
                    </div>
                    <div><label className="block text-sm mb-1">Number of Guests</label><input name="guests" type="number" defaultValue="2" min="1" required className="w-full px-3 py-2 border rounded" /></div>
                    <div><label className="block text-sm mb-1">Special Requests (Optional)</label><textarea name="specialRequests" className="w-full px-3 py-2 border rounded" rows={2} placeholder="Any special requests..." /></div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button type="button" onClick={() => setShowAddReservation(false)} className="px-4 py-2 border rounded">Cancel</button>
                      <button type="submit" className="btn-primary">Create Reservation</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddMedia && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl">Add New Image(s)</h3>
                  <button onClick={() => { setShowAddMedia(false); setAddMediaItems([]); }} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
                </div>
                
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-[#867050] transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files) handleFileSelection(files);
                  }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-[var(--secondary)] mb-1">Drag & drop images or videos here or click to browse</p>
                  <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF, WebP, MP4, WebM</p>
                </div>

                <input 
                  id="file-input"
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) handleFileSelection(e.target.files);
                  }}
                />

                {addMediaItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{addMediaItems.length} item(s) selected</p>
                      <button 
                        type="button" 
                        onClick={() => setAddMediaItems([])} 
                        className="text-sm text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                      {addMediaItems.map((item) => (
                        <div key={item.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          {item.mediaType === 'VIDEO' ? (
                            <video src={item.url} className="w-full h-24 object-cover" />
                          ) : (
                            <img src={item.url} alt={item.filename} className="w-full h-24 object-cover" />
                          )}
                          <button 
                            type="button"
                            onClick={() => removeMediaToAdd(item.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="p-2 bg-white">
                            <label className="block text-[10px] text-gray-500 mb-1">Image Name</label>
                            <input
                              value={item.displayName || item.filename}
                              onChange={(e) => setAddMediaItems((prev) => prev.map((media) => (
                                media.id === item.id ? { ...media, displayName: e.target.value } : media
                              )))}
                              className="w-full px-2 py-1 text-xs border rounded"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-4">
                  <button type="button" onClick={() => { setShowAddMedia(false); setAddMediaItems([]); }} className="px-4 py-2 border rounded">Cancel</button>
                  <button 
                    type="button" 
                    onClick={submitMediaItems}
                    disabled={addMediaItems.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload {addMediaItems.length > 0 ? `(${addMediaItems.length})` : ''} Image(s)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

