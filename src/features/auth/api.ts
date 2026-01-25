// src/features/auth/api.ts
import { apiClient } from '@/src/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// 로그인 요청 타입
interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청 타입
interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

// 토큰 응답 타입
interface TokenResponse {
  token: string;
  type: string;
}

// 로그인 API 함수
export const loginApi = async (credentials: LoginRequest): Promise<TokenResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || new Error('로그인에 실패했습니다.');
  }
};

// 로그인 뮤테이션 훅
export const useLoginMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (tokenResponse) => {
      // 토큰 저장
      saveTokens(tokenResponse);
      
      // 로그인 성공 후 메인 페이지로 이동
      router.push('/');
    },
    onError: (error: any) => {
      // 에러 처리 (알림 등)
      console.error('로그인 에러:', error);
    }
  });
};

// 회원가입 API 함수
export const signUpApi = async (userData: SignUpRequest): Promise<void> => {
  try {
    await apiClient.post('/auth/signup', userData);
  } catch (error: any) {
    throw error.response?.data || new Error('회원가입에 실패했습니다.');
  }
};

// 로그아웃 API 함수
export const logoutApi = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
    // 토큰 제거 로직
    removeTokens();
  } catch (error: any) {
    throw error.response?.data || new Error('로그아웃에 실패했습니다.');
  }
};

// 토큰 저장 유틸리티
export const saveTokens = (tokenResponse: TokenResponse) => {
  localStorage.setItem('accessToken', tokenResponse.token);
  localStorage.setItem('tokenType', tokenResponse.type);
};

// 토큰 제거 유틸리티
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('tokenType');
};

// 토큰 존재 확인 유틸리티
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// 회원가입 뮤테이션 훅 (선택적)
export const useSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push('/login');
    },
    onError: (error: any) => {
      // 에러 처리
      console.error('회원가입 에러:', error);
    }
  });
};