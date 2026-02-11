'use client';

import { TMAP_OPTIONS } from '@/constants/routeOptions';
import { TmapCarRouteResponse } from '../type';

interface RouteMenuProps {
  carRoutes: TmapCarRouteResponse[];
  selectedIdx: number;
  loading: boolean;
  onSearch: () => void;
  onSelect: (idx: number) => void;
  getThemeColor: (idx: number, route: any) => string;
}

export default function RouteMenu({
  carRoutes,
  selectedIdx,
  loading,
  onSearch,
  onSelect,
  getThemeColor,
}: RouteMenuProps) {
  return (
    <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-white border-r">
      {/* 검색 헤더 영역 */}
      <div className="p-6 bg-slate-900 text-white">
        <h1 className="text-xl font-black mb-6 italic tracking-tighter">🛡️ ANSIM MAP</h1>
        <button
          onClick={onSearch}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl font-bold transition-all active:scale-[0.98]"
        >
          {loading ? '경로 분석 중...' : '자동차 경로 검색 🚗'}
        </button>
      </div>

      {/* 경로 리스트 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {carRoutes.map((route, idx) => {
          const info = route.features[0].properties;
          const isSelected = selectedIdx === idx;
          const themeColor = getThemeColor(idx, route);

          return (
            <div
              key={idx}
              onClick={() => onSelect(idx)}
              className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                isSelected
                  ? 'bg-white shadow-md'
                  : 'bg-slate-100 border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ borderColor: isSelected ? themeColor : 'transparent' }}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  {TMAP_OPTIONS[idx]?.name}
                  {route.isAnsimBest && " 🛡️"}
                </span>
                <span className="text-lg font-black text-slate-800">
                  {Math.floor(info.totalTime! / 60)}분
                </span>
              </div>
              <div className="text-xs text-slate-500 flex justify-between items-center">
                <div className="space-x-2">
                  <span className="font-semibold text-slate-700">
                    {(info.totalDistance! / 1000).toFixed(1)}km
                  </span>
                  <span>·</span>
                  <span>약 {info.taxiFare?.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* 데이터가 없을 때의 피드백 */}
        {!loading && carRoutes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
            <p className="text-sm">출발지와 목적지를 설정하고<br/>경로를 검색해보세요.</p>
          </div>
        )}
      </div>
    </aside>
  );
}