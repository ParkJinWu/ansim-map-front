"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // 🚩 bg-sky-50/50 대신 bg-blue-50을 써서 블루톤을 확실히 살립니다.
    <div className="min-h-screen flex bg-blue-50 overflow-x-hidden">
      
      {/* 1. 사이드바 */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. 전체 콘텐츠 영역 */}
      <div 
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <Header onMenuClick={toggleSidebar} />
        

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 min-h-[70vh] p-8 border border-blue-100">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}