'use client';

import { useState, useEffect } from 'react';
import { FavoriteResponse } from '../type';
import { X } from 'lucide-react';

interface FavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: any) => Promise<void>;
  initialData: FavoriteResponse | null;
}

export default function FavoriteModal({ isOpen, onClose, onSave, initialData }: FavoriteModalProps) {
  const [alias, setAlias] = useState('');
  
  // 수정 시에는 기존 별칭을, 추가 시에는 빈 값을 세팅
  useEffect(() => {
    if (isOpen) {
      setAlias(initialData?.alias || '');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in duration-200">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">
            {initialData ? "즐겨찾기 수정" : "즐겨찾기 추가"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* 입력 폼 */}
        <div className="space-y-4">
          {/* 읽기 전용 : 장소 */}
          {initialData && (
            <div className="px-1 py-2 border-b border-slate-50">
              <p className="text-[11px] font-bold text-slate-400 uppercase">장소 정보</p>
              <p className="text-sm font-medium text-slate-600 mt-1 truncate">
                {initialData.placeName || initialData.addressName}
              </p>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-400 ml-1 uppercase tracking-wider">별칭</label>
            <input 
              type="text" 
              placeholder="예: 우리집, 회사"
              className="w-full p-4 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500 mt-1 transition-all"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* TODO */}
          {!initialData && (
             <p className="text-xs text-slate-400 text-center py-2">
               지도에서 선택한 장소를 즐겨찾기에 추가합니다.
             </p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex space-x-3 pt-2">
          <button 
            onClick={onClose} 
            className="flex-1 p-4 bg-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-colors"
          >
            취소
          </button>
          <button 
            onClick={() => onSave({ alias })}
            className="flex-1 p-4 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-colors"
          >
            {initialData ? "수정완료" : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}