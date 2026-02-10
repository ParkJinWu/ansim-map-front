'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, LogOut, Edit2, Clock, Star, Trash2 } from 'lucide-react';
import { getMemberProfile, updateMemberProfile } from '@/services/member/api';
import { MemberResponse } from '@/services/member/type';
import { useAuthStore } from '@/store/useAuthStore';
import { removeTokens } from '@/features/auth/api';
import { useDialog } from '@/components/dialog/useDialog';
import { getFavorites, deleteFavorite, updateFavorite } from '@/services/favorite/api';
import { FavoriteResponse } from '@/services/favorite/type';
import FavoriteModal from '@/services/favorite/components/FavoriteModal';

export default function MyPage() {
  const router = useRouter();
  const { alert, confirm } = useDialog();
  const { memberId, email, accessToken, _hasHydrated, clearAuth } = useAuthStore();

  const [user, setUser] = useState<MemberResponse | null>(null);
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState('');

  // 즐겨찾기 수정 모달 관련
  const [isFavModalOpen, setIsFavModalOpen] = useState(false);
  const [selectedFav, setSelectedFav] = useState<FavoriteResponse | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!accessToken || !memberId) {
      router.push('/login');
      return;
    }

    const initData = async () => {
      try {
        setLoading(true);
        const [profileData, favoriteData] = await Promise.all([
          getMemberProfile(memberId),
          getFavorites()
        ]);
        setUser(profileData);
        setNewName(profileData.name);
        setFavorites(favoriteData);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [_hasHydrated, memberId, accessToken, router]);

  // --- 즐겨찾기 핸들러 (수정/삭제만 유지) ---
  
  const handleUpdateFavorite = async (formData: { alias: string }) => {
    if (!selectedFav) return;
    try {
      const updated = await updateFavorite(selectedFav.id, formData);
      setFavorites(prev => prev.map(f => f.id === updated.id ? updated : f));
      setIsFavModalOpen(false);
      alert("별칭이 수정되었습니다.");
    } catch (error) {
      alert("수정에 실패했습니다.");
    }
  };

  const handleDeleteFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await confirm("해당 즐겨찾기를 삭제하시겠습니까?", {
      title: "삭제 확인",
      theme: "warning",
    });

    if (isConfirmed) {
      try {
        await deleteFavorite(id);
        setFavorites(prev => prev.filter(f => f.id !== id));
        alert("삭제되었습니다.");
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // --- 프로필/로그아웃 핸들러 ---
  const handleLogout = () => {
    removeTokens();
    clearAuth();
    router.push('/login');
  };

  const handleUpdateProfile = async () => {
    if (!newName.trim()) return;
    try {
      const updated = await updateMemberProfile({
        email: email || "",
        name: newName,
        profileImageUrl: user?.profileImageUrl || ""
      });
      setUser(updated);
      setIsEditingProfile(false);
      alert("프로필이 수정되었습니다.");
    } catch (error) {
      alert("프로필 수정에 실패했습니다.");
    }
  };

  if (!_hasHydrated || loading) return <LoadingSkeleton />;

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
        {/* 프로필 섹션 */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center shadow-lg overflow-hidden text-white font-bold text-xl">
              {user?.profileImageUrl ? <img src={user.profileImageUrl} alt="p" className="w-full h-full object-cover" /> : user?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black">{user?.name}</h2>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => setIsEditingProfile(true)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <Edit2 size={20} />
          </button>
        </section>

        {/* 즐겨찾기 섹션 (추가 버튼 제거됨) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Star size={18} className="text-yellow-500 fill-yellow-500" /> 즐겨찾기
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <div key={fav.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative group">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedFav(fav); setIsFavModalOpen(true); }}
                      className="p-1 text-slate-300 hover:text-sky-500"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button onClick={(e) => handleDeleteFavorite(fav.id, e)} className="p-1 text-slate-300 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-slate-800 truncate pr-10">{fav.alias}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{fav.placeName || fav.addressName}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-sm text-slate-400">
                등록된 즐겨찾기가 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* 최근 검색 경로 (UI 유지) */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold px-2 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" /> 최근 검색 경로
          </h3>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b border-slate-50 last:border-none">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-500"><Search size={18} /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">평내호평역 → 서울 시청</p>
                <p className="text-xs text-slate-400 mt-0.5">2026.02.08</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-4 text-center">
          <button onClick={handleLogout} className="inline-flex items-center text-sm text-slate-400 font-medium hover:text-red-500 transition-colors">
            <LogOut size={16} className="mr-2" /> 로그아웃
          </button>
        </footer>
      </div>

      {/* 프로필 수정 모달 */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800">닉네임 변경</h3>
            <input type="text" className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <div className="flex space-x-3 pt-2">
              <button onClick={() => setIsEditingProfile(false)} className="flex-1 p-4 bg-slate-100 rounded-2xl font-bold">취소</button>
              <button onClick={handleUpdateProfile} className="flex-1 p-4 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-200">저장하기</button>
            </div>
          </div>
        </div>
      )}

      {/* 즐겨찾기 수정 전용 모달 */}
      <FavoriteModal 
        isOpen={isFavModalOpen}
        onClose={() => setIsFavModalOpen(false)}
        onSave={handleUpdateFavorite}
        initialData={selectedFav}
      />
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-slate-400 text-sm">정보를 안전하게 불러오는 중...</p>
      </div>
    </div>
  );
}