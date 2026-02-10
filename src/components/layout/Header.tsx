"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoggedIn = !!accessToken;

  return (
    // 배경을 더 맑은 sky-50으로 변경
    <header className="flex h-16 w-full items-center justify-between px-6 bg-sky-50/90 backdrop-blur-sm border-b border-sky-100 sticky top-0 z-30 transition-all">
      
      {/* 왼쪽: 메뉴 버튼 & 로고 */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-white rounded-xl text-sky-500 transition-colors active:scale-95 shadow-sm shadow-sky-200/50"
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
        
        <Link href="/" className="text-xl font-black text-sky-500 tracking-tight">
          ANSIM <span className="text-sky-400 font-light">MAP</span>
        </Link>
      </div>

      {/* 오른쪽: 인증 상태에 따른 버튼 */}
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <Link 
            href="/mypage" 
            className="flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-2 text-sm font-bold text-white hover:bg-sky-500 transition-all shadow-md shadow-sky-200 active:scale-95"
          >
            <User size={18} />
            <span>마이페이지</span>
          </Link>
        ) : (
          <div className="flex items-center gap-5">
            <Link 
              href="/login" 
              className="text-sm font-bold text-sky-400 hover:text-sky-600 transition-colors"
            >
              로그인
            </Link>
            <Link 
              href="/signup" 
              className="rounded-2xl bg-sky-400 px-5 py-2 text-sm font-bold text-white hover:bg-sky-500 transition-all shadow-md shadow-sky-200 active:scale-95"
            >
              시작하기
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}