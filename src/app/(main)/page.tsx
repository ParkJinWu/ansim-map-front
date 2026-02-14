'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import { useMap } from '@/hooks/useMap';
import RouteMenu from '@/services/route/components/RouteMenu';
import PlaceMenu from '@/services/plcae/components/PlaceMenu';
import { Tab } from '@/components/common/Tab';
import { TmapCarRouteResponse } from '@/services/route/type';
import { TMAP_OPTIONS } from '@/constants/routeOptions';
import { getCarPath } from '@/services/route/api';
import { getFavorites } from '@/services/favorite/api';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { FavoriteResponse } from '@/services/favorite/type';

const MENU_TABS = [
  { title: "장소 검색", id: "place" },
  { title: "길찾기", id: "route" },
];

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, initMap, drawRoute, moveMap, displayFavoriteMarkers } = useMap();

  const [activeTab, setActiveTab] = useState("place");
  const [loading, setLoading] = useState(false);
  const [carRoutes, setCarRoutes] = useState<TmapCarRouteResponse[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [startPoint, setStartPoint] = useState({ display: '', value: '' });
  const [endPoint, setEndPoint] = useState({ display: '', value: '' });
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  const getRouteThemeColor = (idx: number, routeData?: TmapCarRouteResponse) => {
    if (routeData?.isAnsimBest) return '#8b5cf6';
    return TMAP_OPTIONS[idx]?.color || '#3b82f6';
  };

  // 1. 길찾기 핸들러 
  const handleSearch = async (startAddr: string, endAddr: string) => {
    if (!startAddr || !endAddr) return;

    setLoading(true);
    setCarRoutes([]);

    try {
      const data = await getCarPath({ startAddr, endAddr });

      if (data && data.length > 0) {
        setCarRoutes(data);
        setSelectedIdx(0);

        // 2. 지도에 첫 번째 경로 그리기
        drawRoute(data[0], getRouteThemeColor(0, data[0]));
      } else {
        alert("검색 결과가 없습니다.");
      }
    } catch (error) {
      console.error("경로 검색 실패:", error);
      alert("경로를 찾는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (_hasHydrated && isAuthenticated) {
        try {
          const data = await getFavorites();
          setFavorites(data); // 데이터를 상태에 저장
        } catch (err) {
          console.error("즐겨찾기 목록 로드 에러:", err);
        }
      }
    };
    fetchFavorites();
  }, [_hasHydrated, isAuthenticated]);

  // 2. 지도(map)가 준비되면 마커를 그리는 Effect
  useEffect(() => {
    if (map && favorites.length > 0) {
      displayFavoriteMarkers(favorites);
    }
  }, [map, favorites, displayFavoriteMarkers]); // 지도가 로드되거나 데이터가 들어오면 실행

  return (
    <main className="relative w-full h-screen bg-white flex overflow-hidden">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`}
        onLoad={() => { if (mapContainer.current) initMap(mapContainer.current); }}
      />

      <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-slate-900 border-r border-slate-800">
        <div className="p-6 pb-2 text-white">
          <h1 className="text-xl font-black mb-4 italic tracking-tighter text-blue-400">ANSIM MAP</h1>
          <Tab tabs={MENU_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex-1 overflow-hidden bg-white">
          {activeTab === "place" ? (
            <PlaceMenu
              onMoveMap={moveMap}
              onSetRoute={(type, place) => {
                const data = { display: place.name, value: place.address };
                if (type === 'start') setStartPoint(data);
                else setEndPoint(data);
                setActiveTab("route"); // 탭 자동 전환
              }}
            />
          ) : (
            <RouteMenu
              startPoint={startPoint} setStartPoint={setStartPoint}
              endPoint={endPoint} setEndPoint={setEndPoint}
              carRoutes={carRoutes} selectedIdx={selectedIdx}
              loading={loading} onSearch={handleSearch}
              onSelect={(idx) => {
                setSelectedIdx(idx);
                drawRoute(carRoutes[idx], getRouteThemeColor(idx, carRoutes[idx]));
              }}
              getThemeColor={getRouteThemeColor}
            />
          )}
        </div>
      </aside>

      <section className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
      </section>
    </main>
  );
}