'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import { getCarPath } from '@/services/route/api';
import { TmapCarRouteResponse, TmapFeature } from '@/services/route/type';
import { TMAP_OPTIONS } from '@/constants/routeOptions';

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [carRoutes, setCarRoutes] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [currentLines, setCurrentLines] = useState<any[]>([]);

  const initMap = () => {
    window.kakao.maps.load(() => {
      if (!mapContainer.current) return;
      const options = { center: new window.kakao.maps.LatLng(37.5665, 126.9780), level: 5 };
      setMap(new window.kakao.maps.Map(mapContainer.current, options));
    });
  };

  // 경로 그리기 로직 (데이터에 따라 동적으로 결정된 색상 사용)
  const drawRoute = (data: TmapCarRouteResponse, color: string) => {
    if (!map) return;
    currentLines.forEach(line => line.setMap(null));
    const newLines: any[] = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    data.features.forEach((feature: TmapFeature) => {
      if (feature.geometry.type === "LineString") {
        const linePath = feature.geometry.coordinates.map((coord: [number, number]) => {
          const pos = new window.kakao.maps.LatLng(coord[1], coord[0]);
          bounds.extend(pos);
          return pos;
        });
        const polyline = new window.kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 7,
          strokeColor: color,
          strokeOpacity: 0.8,
        });
        polyline.setMap(map);
        newLines.push(polyline);
      }
    });
    setCurrentLines(newLines);
    map.setBounds(bounds);
  };

  // 경로별 테마 색상을 결정하는 헬퍼 함수
  const getRouteThemeColor = (idx: number, routeData?: any) => {
    // TODO 
    // 1. 만약 백엔드에서 '안심 경로 1위'로 선정했다면 보라색
    if (routeData?.isAnsimBest) return '#8b5cf6';
    
    // 2. 그 외에는 상수에 정의된 기본색 (파란색 계열) 사용
    return TMAP_OPTIONS[idx]?.color || '#3b82f6';
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getCarPath({ sx: "126.9780", sy: "37.5665", ex: "127.0276", ey: "37.4979" });
      setCarRoutes(data);
      setSelectedIdx(0);
      
      // 첫 검색 시 첫 번째 경로의 테마색으로 그리기
      drawRoute(data[0], getRouteThemeColor(0, data[0]));
    } catch (err) {
      console.error("경로 탐색 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectRoute = (idx: number) => {
    setSelectedIdx(idx);
    const themeColor = getRouteThemeColor(idx, carRoutes[idx]);
    drawRoute(carRoutes[idx], themeColor);
  };

  return (
    <main className="relative w-full h-screen bg-white flex overflow-hidden">
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`} 
        onLoad={initMap} 
      />

      <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-white border-r">
        <div className="p-6 bg-slate-900 text-white">
          <h1 className="text-xl font-black mb-6 italic tracking-tighter">🛡️ ANSIM MAP</h1>
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            {loading ? '경로 분석 중...' : '자동차 경로 검색 🚗'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {carRoutes.map((route, idx) => {
            const info = route.features[0].properties;
            const isSelected = selectedIdx === idx;
            const themeColor = getRouteThemeColor(idx, route);

            return (
              <div
                key={idx}
                onClick={() => selectRoute(idx)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${
                  isSelected ? 'bg-white shadow-md' : 'bg-slate-100 border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ borderColor: isSelected ? themeColor : 'transparent' }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${themeColor}15`,
                      color: themeColor
                    }}
                  >
                    {TMAP_OPTIONS[idx]?.name}
                    {route.isAnsimBest && " 🛡️"} {/* 안심 경로일 때만 아이콘 추가 */}
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    {Math.floor(info.totalTime! / 60)}분
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex justify-between items-center">
                  <div className="space-x-2">
                    <span className="font-semibold text-slate-700">{(info.totalDistance! / 1000).toFixed(1)}km</span>
                    <span>·</span>
                    <span>약 {info.taxiFare?.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <section className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 bg-white/40 z-50 flex flex-col items-center justify-center backdrop-blur-[2px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm font-bold text-slate-700">데이터 기반 안심 경로 분석 중...</p>
          </div>
        )}
      </section>
    </main>
  );
}