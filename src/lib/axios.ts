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
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 백엔드 에러 응답 구조에 맞춰 메시지 추출
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      '알 수 없는 오류가 발생했습니다.';

    console.error('API 에러 발생:', {
      status: error.response?.status,
      message: errorMessage,
      url: error.config?.url
    });


    if (error.response?.status === 401) {
      console.warn('인증이 만료되었습니다.');
    }
    return Promise.reject(error);
  }
);