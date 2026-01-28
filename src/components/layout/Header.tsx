"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      await apiClient.post("/auth/logout", email, {
        headers: { "Content-Type": "text/plain" }
      });
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      window.location.href = "/"; // 메인으로 이동하며 상태 초기화
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between px-8 bg-white border-b border-sky-100">
      <Link href="/" className="text-xl font-bold text-sky-600">ANSIM MAP</Link>

      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          /* --- 로그인 상태 --- */
          <>
            <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-500">
              로그아웃
            </button>
            <Link 
              href="/mypage" 
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white hover:bg-sky-400 transition-all"
            >
              마이페이지
            </Link>
          </>
        ) : (
          /* --- 로그아웃 상태 --- */
          <>
            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-sky-600">
              로그인
            </Link>
            <Link 
              href="/signup" 
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white hover:bg-sky-400 transition-all"
            >
              시작하기
            </Link>
          </>
        )}
      </div>
    </header>
  );
}