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

// 1. 요청 인터셉터: 모든 API 요청 전에 실행됨
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 액세스 토큰을 꺼내 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      '알 수 없는 오류가 발생했습니다.';

    //  TODO : 401 에러(토큰 만료) 발생 시 처리 로직 추가
    if (error.response?.status === 401) {
      console.warn('인증이 만료되었습니다. 다시 로그인해주세요.');
      // TODO : 여기서 RefreshToken을 이용한 재발급 로직을 실행하거나 로그아웃 처리
    }

    console.error('API 에러:', errorMessage);

    if (error.config?.showErrorDialog) {
      window.alert(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);