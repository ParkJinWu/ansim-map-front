import { useAuthStore } from '@/store/useAuthStore';
import axios, { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    showErrorDialog?: boolean;
    showLoading?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // 쿠키
  headers: {
    'Content-Type': 'application/json',
    Accept: "application/json",
  },
  showErrorDialog: true,
  showLoading: false,
} as AxiosRequestConfig);

// 요청 인터셉터: 모든 API 요청 전에 실행됨
apiClient.interceptors.request.use(
  (config) => {
    // Zustand persist가 저장하는 키 이름을 가져옴
    const authStorage = localStorage.getItem('ansim-auth-storage');

    if (authStorage && config.headers) {
      try {
        const parsed = JSON.parse(authStorage);
        const token = parsed.state?.accessToken; // Zustand에 저장한 필드명

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('인증 토큰 파싱 실패:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
// 응답 인터셉터 수정
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.';

    // 401 Unauthorized: 토큰 만료 또는 유효하지 않은 인증
    if (error.response?.status === 401) {
      console.warn('인증이 만료되었습니다. 로그아웃 처리합니다.');

      // 1. clearAuth를 사용하여 스토어와 로컬 스토리지를 비웁니다.
      // 이 메서드는 persist 미들웨어에 의해 'ansim-auth-storage'도 함께 비워줍니다.
      useAuthStore.getState().clearAuth();

      // 2. 필요하다면 페이지 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);