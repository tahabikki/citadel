

// Base URL for the API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    },
    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phone?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return response.json();
    },
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Logout failed');
      }
      return response.json();
    },
    getSession: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
  },

  // Room endpoints
  rooms: {
    getAll: async (filters: {
      checkIn?: string;
      checkOut?: string;
      guests?: number;
      type?: string;
    } = {}) => {
      const queryParams = new URLSearchParams();
      if (filters.checkIn) queryParams.append('checkIn', filters.checkIn);
      if (filters.checkOut) queryParams.append('checkOut', filters.checkOut);
      if (filters.guests) queryParams.append('guests', filters.guests.toString());
      if (filters.type) queryParams.append('type', filters.type);

      const response = await fetch(`${API_BASE_URL}/rooms?${queryParams.toString()}`, {
        method: 'GET',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch rooms');
      }
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
        method: 'GET',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch room');
      }
      return response.json();
    },
  },

  // Reservation endpoints
  reservations: {
    create: async (reservationData: {
      roomId: string;
      checkIn: string;
      checkOut: string;
      guests: number;
      adults?: number;
      children?: number;
      specialRequests?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservationData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create reservation');
      }
      return response.json();
    },
    getByUser: async () => {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch reservations');
      }
      return response.json();
    },
    updateStatus: async (reservationId: string, action: 'check-in' | 'check-out' | 'cancel') => {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId, action }),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update reservation');
      }
      return response.json();
    },
  },

  // Payment endpoints
  payments: {
    process: async (paymentData: {
      reservationId: string;
      paymentMethod: string;
      amount: number;
    }) => {
      const response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment processing failed');
      }
      return response.json();
    },
  },

  // Task endpoints
  tasks: {
    getAll: async (status?: string) => {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      const response = await fetch(`${API_BASE_URL}/tasks?${queryParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch tasks');
      }
      return response.json();
    },
    create: async (taskData: {
      reservationId: string;
      type: string;
      accessLevel?: number;
    }) => {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create task');
      }
      return response.json();
    },
    update: async (taskId: string, updateData: {
      status?: string;
      result?: string;
      errorMessage?: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update task');
      }
      return response.json();
    },
  },
};

// Helper function to handle API errors
export const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
