import { apiClient } from './apiClient';

export type AuthAction = 'login' | 'register' | 'logout';

export type AuthInput = {
  action: AuthAction;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export const userService = {
  getSession() {
    return apiClient.get<{ user: unknown | null }>('/auth');
  },
  login(email: string, password: string) {
    return apiClient.post<{ user: unknown }>('/auth', { action: 'login', email, password });
  },
  register(input: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    return apiClient.post<{ user: unknown }>('/auth', { action: 'register', ...input });
  },
  logout() {
    return apiClient.post<{ success: boolean }>('/auth', { action: 'logout' });
  }
};
