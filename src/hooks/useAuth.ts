import { create } from 'zustand';
import axios from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const { user, token } = response.data;
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (data) => {
    try {
      await axios.post('/auth/register', data);
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
}));