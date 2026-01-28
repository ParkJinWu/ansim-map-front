// app/(main)/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    // 1. 배경을 아주 연한 하늘색(sky-50)으로 설정
    <div className="min-h-screen flex flex-col bg-sky-50/50">
      <Header />
      
      {/* 2. 메인 영역: 페이지 콘텐츠가 들어가는 곳 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* 콘텐츠가 들어가는 카드는 다시 흰색으로 띄워서 대비를 줌 */}
        <div className="bg-white rounded-3xl shadow-xl shadow-sky-100/50 min-h-[60vh] p-6 border border-sky-100">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}