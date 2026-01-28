// components/layout/Footer.tsx
export default function Footer() {
  return (
    // 1. py-4로 높이를 절반으로 줄이고, 배경색을 연한 하늘색으로 변경
    <footer className="w-full bg-sky-50 py-4 px-8 border-t border-sky-100">
      {/* 2. max-w-7xl을 제거하고 헤더와 동일하게 w-full / justify-between 설정 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* 서비스 이름 및 카피라이트 */}
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-sky-900">ANSIM MAP</h2>
          <p className="text-xs text-sky-600/70">
            © 2026 ANSIM MAP. All rights reserved.
          </p>
        </div>

        {/* 하단 링크 메뉴 */}
        <div className="flex space-x-6 text-xs font-bold text-sky-700/80">
          <button className="hover:text-sky-500 transition-colors">이용약관</button>
          <button className="hover:text-sky-500 transition-colors">개인정보처리방침</button>
          <button className="hover:text-sky-500 transition-colors">고객센터</button>
        </div>
      </div>
    </footer>
  );
}