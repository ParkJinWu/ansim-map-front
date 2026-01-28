// src/features/auth/api.ts
import { apiClient } from '@/lib/axios';
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
  accessToken: string;
  refreshToken: string;
  grantType: string;
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
  const token = localStorage.getItem('accessToken');

  // 브라우저 콘솔에서 이 로그를 확인하세요! (F12)
  console.log("전송될 토큰의 원본 값:", token);

  // 토큰이 없으면 굳이 서버에 요청하지 않고 클라이언트만 정리합니다.
  if (!token || token === 'undefined' || token === 'null') {
    console.warn("전송할 토큰이 없습니다. 클라이언트 상태만 정리합니다.");
    removeTokens();
    window.location.href = '/';
    return;
  }

  try {
    await apiClient.post('/auth/logout', null, {
      headers: {
        // 인터셉터가 중복으로 'Bearer'를 붙이지 않는지 확인하며 수동 주입
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("서버 로그아웃 성공");
  } catch (error: any) {
    console.error("서버 로그아웃 에러:", error.message);
  } finally {
    removeTokens();
    localStorage.removeItem('userEmail');
    //window.location.href = '/';
  }
};


// 토큰 저장 유틸리티
export const saveTokens = (tokenResponse: TokenResponse) => {
  // 백엔드 필드명인 accessToken과 grantType을 사용합니다.
  if (tokenResponse.accessToken) {
    localStorage.setItem('accessToken', tokenResponse.accessToken);
    localStorage.setItem('tokenType', tokenResponse.grantType);
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