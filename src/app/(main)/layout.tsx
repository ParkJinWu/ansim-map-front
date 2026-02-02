"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar"; // 사이드바 컴포넌트 임포트

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-sky-50/50 overflow-x-hidden">
      {/* 1. 사이드바 - 항상 존재하지만 isOpen에 따라 화면 밖/안 이동 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. 전체 콘텐츠 영역 - 사이드바가 열리면 ml-72(280px)만큼 오른쪽으로 밀림 */}
      <div 
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* 헤더에 메뉴 버튼 클릭 함수 전달 */}
        <Header onMenuClick={toggleSidebar} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-sky-100/50 min-h-[60vh] p-6 border border-sky-100">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}