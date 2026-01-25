import axios, { AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    showErrorDialog?: boolean;
    showLoading?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: "application/json",
  },
  showErrorDialog: true,
  showLoading: false,
} as AxiosRequestConfig);

apiClient.interceptors.response.use(
  response => response,
  error => {
    // 에러 처리 로직
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data || 
      error.message || 
      '알 수 없는 오류가 발생했습니다.';

    console.error('API 에러:', errorMessage);

    if (error.config?.showErrorDialog) {
      // 에러 다이얼로그 표시 로직
      window.alert(errorMessage);
    }

    return Promise.reject(new Error(errorMessage));
  }
);