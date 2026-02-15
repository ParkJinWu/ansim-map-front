import { create } from 'zustand';
import { FavoriteResponse } from '@/services/favorite/type';
import { getFavorites } from '@/services/favorite/api';

interface FavoriteState {
  favorites: FavoriteResponse[];
  isLoading: boolean;
  error: string | null;
  // 즐겨찾기 목록 새로고침 (로그인 시 또는 추가/삭제 후 호출)
  fetchFavorites: () => Promise<void>;
  // 상태 초기화 (로그아웃 시 사용)
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>((set) => ({
  favorites: [],
  isLoading: false,
  error: null,

  fetchFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getFavorites();
      set({ favorites: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || '즐겨찾기를 불러오지 못했습니다.', isLoading: false });
    }
  },

  clearFavorites: () => set({ favorites: [], error: null }),
}));