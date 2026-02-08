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
        await apiClient.post("/auth/logout", email, {
          headers: { "Content-Type": "text/plain" }
        });
      } catch (error) {
        console.error("로그아웃 실패:", error);
      } finally {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        window.dispatchEvent(new Event("auth-change"));
        onClose();
        window.location.href = "/";
      }
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full w-72 bg-sky-50 border-r border-sky-100 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl shadow-sky-900/10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* 1. 상단 헤더 - 로고 영역 */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-sky-100/50 bg-sky-100/20 flex-shrink-0">
        <span className="text-xl font-black text-sky-500 tracking-tight">ANSIM <span className="text-sky-400 font-light">MAP</span></span>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-white rounded-lg transition-colors text-sky-300 hover:text-sky-500 shadow-sm shadow-sky-100/50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. 메인 메뉴 */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto font-sans">
        <SidebarItem href="/" icon={<Home size={20} />} label="홈" onClick={onClose} />
        <SidebarItem href="/map" icon={<ShieldCheck size={20} />} label="안심 지도" onClick={onClose} />
        <SidebarItem href="/mypage" icon={<User size={20} />} label="마이페이지" onClick={onClose} />
      </nav>

      {/* 3. 하단 로그아웃 영역 */}
      <div className="mt-auto pb-4">
        <div className="mx-6 border-t border-sky-200/50 mb-2" />
        <div className="px-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 px-4 py-3 text-sky-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">로그아웃</span>
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
      className="flex items-center gap-4 px-4 py-3 text-sky-600/80 hover:bg-sky-400 hover:text-white rounded-2xl transition-all font-bold group shadow-sm shadow-transparent hover:shadow-sky-200"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}