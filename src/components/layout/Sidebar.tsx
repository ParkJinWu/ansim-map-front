"use client";

import { X, Home, ShieldCheck, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useDialog } from "../dialog/useDialog";
import { apiClient } from "@/lib/axios";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { confirm } = useDialog();

  const handleLogout = async () => {
    const isConfirmed = await confirm("정말 로그아웃 하시겠습니까?", {
      title: "로그아웃 확인",
      theme: "info",
      confirmText: "로그아웃",
      cancelText: "취소"
    });

    if (isConfirmed) {
      try {
        const email = localStorage.getItem("userEmail");
        // API 호출 (Header에 있던 로직)
        await apiClient.post("/auth/logout", email, {
          headers: { "Content-Type": "text/plain" }
        });
      } catch (error) {
        console.error("로그아웃 실패:", error);
      } finally {
        // 상태 초기화 및 페이지 이동
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        window.dispatchEvent(new Event("auth-change")); // 헤더 상태 업데이트용
        onClose(); // 사이드바 닫기
        window.location.href = "/";
      }
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-sky-100 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* 1. 상단 헤더 */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-sky-50 flex-shrink-0">
        <span className="text-xl font-bold text-sky-600">ANSIM MAP</span>
        <button onClick={onClose} className="p-1 hover:bg-sky-50 rounded-lg">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* 2. 메인 메뉴 (중간 영역을 가득 채움) */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        <SidebarItem href="/" icon={<Home size={20} />} label="홈" onClick={onClose} />
        <SidebarItem href="/map" icon={<ShieldCheck size={20} />} label="안심 지도" onClick={onClose} />
        <SidebarItem href="/mypage" icon={<User size={20} />} label="마이페이지" onClick={onClose} />
      </nav>

      
      {/* 3. 하단 로그아웃 영역 */}
      <div className="mt-auto">
        <div className="mx-4 border-t border-gray-200" />
        
        <div className="py-2 px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-4 py-3 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform text-gray-400 group-hover:text-red-500" />
            <span className="font-semibold">로그아웃</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}