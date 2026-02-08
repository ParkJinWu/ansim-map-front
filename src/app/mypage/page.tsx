'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, MapPin, Search, LogOut, Edit2,Clock, Star } from 'lucide-react';
import { getMemberProfile, updateMemberProfile } from '@/services/member/api';
import { MemberResponse } from '@/services/member/type';
import { useAuthStore } from '@/store/useAuthStore';
import { removeTokens } from '@/features/auth/api';
import { useDialog } from '@/components/dialog/useDialog';

export default function MyPage() {
  const router = useRouter();
  const { alert } = useDialog();

  const { memberId, email,clearAuth } = useAuthStore();  
  
  const [user, setUser] = useState<MemberResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  // 2. 초기 데이터 로드
  useEffect(() => {
    const fetchProfile = async () => {
      // 로그인이 안 되어 있거나 memberId가 없으면 로그인 페이지로 이동
      if (!memberId) {
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const data = await getMemberProfile(memberId); 
        setUser(data);
        setNewName(data.name);
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [memberId, router]);

  // 3. 로그아웃 핸들러
  const handleLogout = () => {
    removeTokens(); // 로컬스토리지 토큰 삭제
    clearAuth();    // Zustand 상태 초기화
    router.push('/login');
  };

  // 4. 프로필 수정 핸들러
  const handleUpdate = async () => {
    if (!newName.trim()) return;
  try {
    const updated = await updateMemberProfile({
      email: email || "",
      name: newName,
      profileImageUrl: user?.profileImageUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    });
      setUser(updated);
      setIsEditing(false);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      alert("프로필 수정이 실패했습니다.", {
          theme: "warning",
          title: "수정 실패"
        });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="p-4 bg-white border-b flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-lg font-bold">내 정보</h1>
        <div className="w-10" /> 
      </nav>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {user.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-xl">{user.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-black">{user.name}</h2>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
          <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <Edit2 size={20} />
          </button>
        </section>

        {/* 즐겨찾기 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" /> 즐겨찾기
            </h3>
            <button className="text-blue-600 hover:text-blue-700 transition-colors">
              <Plus size={20} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <p className="font-bold text-slate-800">우리집</p>
              <p className="text-xs text-slate-400 mt-1 truncate">경기도 남양주시...</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <p className="font-bold text-slate-800">회사</p>
              <p className="text-xs text-slate-400 mt-1 truncate">서울시 강남구...</p>
            </div>
          </div>
        </section>

        {/* 최근 경로 섹션  */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-2 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" /> 최근 검색 경로
          </h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 hover:bg-slate-50 border-b border-slate-50 last:border-none flex items-center gap-4 cursor-pointer">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                <Search size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">평내호평역 → 서울 시청</p>
                <p className="text-xs text-slate-400 mt-0.5">2026.02.08</p>
              </div>
            </div>
            <div className="p-4 hover:bg-slate-50 flex items-center gap-4 cursor-pointer">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                <Search size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">잠실 롯데타워 → 강남역</p>
                <p className="text-xs text-slate-400 mt-0.5">2026.02.04</p>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="pt-4 text-center">
          <button 
            onClick={handleLogout}
            className="inline-flex items-center text-sm text-slate-400 font-medium hover:text-red-500 transition-colors"
          >
            <LogOut size={16} className="mr-2" /> 로그아웃
          </button>
        </footer>
      </div>

      {/* 수정 모달 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">닉네임 변경</h3>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setIsEditing(false)} className="flex-1 p-4 bg-slate-100 rounded-2xl font-bold">취소</button>
              <button onClick={handleUpdate} className="flex-1 p-4 bg-blue-600 text-white rounded-2xl font-bold">저장하기</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}