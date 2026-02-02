"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      {/* 1. 사이드바 (고정 폭 280px 가정) */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. 메인 콘텐츠 영역 */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* 헤더에 메뉴 토글 버튼을 전달할 수도 있습니다 */}
        <Header onMenuClick={toggleSidebar} />
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}