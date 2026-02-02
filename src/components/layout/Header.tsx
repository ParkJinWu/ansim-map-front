"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react"; // 필요한 아이콘 임포트

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 토큰 존재 여부로 로그인 상태 확인
    const syncLoginStatus = () => {
      const token = localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    // 초기 로드 시 실행
    syncLoginStatus();

    // 커스텀 이벤트(auth-change) 감지하여 상태 동기화
    window.addEventListener("auth-change", syncLoginStatus);
    return () => window.removeEventListener("auth-change", syncLoginStatus);
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between px-6 bg-white border-b border-sky-100 sticky top-0 z-30 transition-all">
      {/* 왼쪽: 메뉴 버튼 & 로고 */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-sky-50 rounded-lg text-sky-600 transition-colors active:scale-95"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
        
        <Link href="/" className="text-xl font-bold text-sky-600 tracking-tight">
          ANSIM MAP
        </Link>
      </div>

      {/* 오른쪽: 인증 상태에 따른 버튼 */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          /* --- 로그인 상태: 마이페이지 버튼만 노출 --- */
          <Link 
            href="/mypage" 
            className="flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-100 active:scale-95"
          >
            <User size={18} />
            <span>마이페이지</span>
          </Link>
        ) : (
          /* --- 로그아웃 상태: 로그인 & 시작하기 노출 --- */
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-gray-600 hover:text-sky-600 transition-colors"
            >
              로그인
            </Link>
            <Link 
              href="/signup" 
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white hover:bg-sky-600 transition-all shadow-md shadow-sky-100 active:scale-95"
            >
              시작하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}