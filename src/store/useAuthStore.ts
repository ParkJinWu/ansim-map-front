// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  memberId: number | null;
  name: string | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setLoginInfo: (id: number, name: string, email: string, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      memberId: null,
      name: null,
      email: null,
      accessToken: null,
      isAuthenticated: false,
      setLoginInfo: (id, name, email, token) =>
        set({ 
          memberId: id, 
          name, 
          email, 
          accessToken: token, 
          isAuthenticated: true 
        }),
      clearAuth: () =>
        set({ 
          memberId: null, 
          name: null, 
          email: null, 
          accessToken: null, 
          isAuthenticated: false 
        }),
    }),
    {
      name: 'ansim-auth-storage',
    }
  )
);