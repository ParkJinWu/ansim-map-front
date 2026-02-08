// src/features/auth/api.ts
import { apiClient } from '@/lib/axios';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

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
  accessToken: string;
  refreshToken: string;
  grantType: string;
  memberId: number;
  email: string;
  name: string;
}

// 로그인 API 함수
export const loginApi = async (credentials: LoginRequest): Promise<TokenResponse> => {
  try {
    const response = await apiClient.post('/auth/login', credentials);

    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || new Error('로그인에 실패했습니다.');
  }
};

// 로그인 뮤테이션 훅
export const useLoginMutation = () => {
  const router = useRouter();
  const setLoginInfo = useAuthStore((state) => state.setLoginInfo);

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setLoginInfo(data.memberId, data.name, data.email, data.accessToken);
      
      router.push('/');
    },
    onError: (error: any) => {
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
  const { accessToken, clearAuth } = useAuthStore.getState();

  if (!accessToken) {
    clearAuth();
    window.location.href = '/login';
    return;
  }

  try {
    await apiClient.post('/auth/logout', null, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
  } catch (error: any) {
    console.error("서버 로그아웃 에러:", error.message);
  } finally {
    clearAuth();
    window.location.href = '/login';
  }
};


// 토큰 저장 유틸리티
export const saveTokens = (tokenResponse: TokenResponse) => {
  if (tokenResponse && tokenResponse.accessToken) {
    localStorage.setItem('accessToken', tokenResponse.accessToken);
    localStorage.setItem('tokenType', tokenResponse.grantType);

    window.dispatchEvent(new Event("auth-change"));
  } else {
    console.error("저장할 토큰이 없습니다. 응답 구조를 확인하세요:", tokenResponse);
  }
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

// 회원가입 뮤테이션 훅
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