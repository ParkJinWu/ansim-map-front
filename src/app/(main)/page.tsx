'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';
import { getCarPath } from '@/services/route/api';
import { TmapCarRouteResponse } from '@/services/route/type';
import { TMAP_OPTIONS } from '@/constants/routeOptions';
import { useMap } from '@/hooks/useMap';
import RouteMenu from '@/services/route/components/RouteMenu';

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  
  // 1. 커스텀 훅 사용 (지도 관련 로직 격리)
  const { initMap, drawRoute } = useMap();

  const [loading, setLoading] = useState(false);
  const [carRoutes, setCarRoutes] = useState<TmapCarRouteResponse[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // 경로별 테마 색상 결정 헬퍼
  const getRouteThemeColor = (idx: number, routeData?: TmapCarRouteResponse) => {
    if (routeData?.isAnsimBest) return '#8b5cf6'; // 안심 베스트는 보라색
    return TMAP_OPTIONS[idx]?.color || '#3b82f6';
  };

  // 검색 핸들러
  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getCarPath({ sx: "126.9780", sy: "37.5665", ex: "127.0276", ey: "37.4979" });
      setCarRoutes(data);
      setSelectedIdx(0);
      
      // 첫 검색 시 첫 번째 경로 그리기
      drawRoute(data[0], getRouteThemeColor(0, data[0]));
    } catch (err) {
      console.error("경로 탐색 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 경로 선택 핸들러
  const handleSelectRoute = (idx: number) => {
    setSelectedIdx(idx);
    const themeColor = getRouteThemeColor(idx, carRoutes[idx]);
    drawRoute(carRoutes[idx], themeColor);
  };

  return (
    <main className="relative w-full h-screen bg-white flex overflow-hidden">
      {/* 카카오맵 스크립트 로드 후 initMap 실행 */}
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`} 
        onLoad={() => {
          if (mapContainer.current) {
            initMap(mapContainer.current);
          }
        }} 
      />

      {/* 2. 분리된 메뉴 컴포넌트 사용 */}
      <RouteMenu 
        carRoutes={carRoutes}
        selectedIdx={selectedIdx}
        loading={loading}
        onSearch={handleSearch}
        onSelect={handleSelectRoute}
        getThemeColor={getRouteThemeColor}
      />

      {/* 지도 영역 */}
      <section className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* 로딩 오버레이 */}
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