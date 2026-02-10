// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  memberId: number | null;
  name: string | null;
  email: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean; // 상태 복구 완료 여부
  setLoginInfo: (id: number, name: string, email: string, token: string) => void;
  clearAuth: () => void;
  setHasHydrated: (state: boolean) => void; // 상태 변경 함수
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      memberId: null,
      name: null,
      email: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false, // 초기값은 false
      
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
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'ansim-auth-storage',
      // 스토어 초기화 시 실행되는 콜백
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);