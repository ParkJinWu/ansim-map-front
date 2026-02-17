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
import { LocateFixed } from 'lucide-react';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { addRecentPath } from '@/services/recentPath/api';

const MENU_TABS = [
  { title: "장소 검색", id: "place" },
  { title: "길찾기", id: "route" },
];

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, initMap, drawRoute, moveMap, displayFavoriteMarkers, moveToCurrentPosition } = useMap();
  const [activeTab, setActiveTab] = useState("place");
  const [loading, setLoading] = useState(false);
  const [carRoutes, setCarRoutes] = useState<TmapCarRouteResponse[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [startPoint, setStartPoint] = useState({ display: '', value: '' });
  const [endPoint, setEndPoint] = useState({ display: '', value: '' });
  const { favorites, fetchFavorites } = useFavoriteStore();
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
        drawRoute(data[0], getRouteThemeColor(0, data[0]));

        // ✅ [추가] 최근 경로 저장 로직 (비동기로 조용히 실행)
        // data[0]에 출발지/목적지의 상세 정보(위경도 등)가 포함되어 있다고 가정합니다.
        const firstRoute = data[0];

        if (isAuthenticated) {
          addRecentPath({
            startPlaceName: startPoint.display || "출발지",
            startAddressName: startAddr,
            startLatitude: Number(firstRoute.startLat), // String을 Number로 변환
            startLongitude: Number(firstRoute.startLon),
            endPlaceName: endPoint.display || "목적지",
            endAddressName: endAddr,
            endLatitude: Number(firstRoute.endLat),
            endLongitude: Number(firstRoute.endLon),
          }).catch(err => console.error("최근 경로 저장 실패:", err));
        }

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

  // 즐겨찾기 마커 템플릿 함수
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      fetchFavorites(); // 스토어의 fetch 함수 호출
    }
  }, [_hasHydrated, isAuthenticated, fetchFavorites]);

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
        <button
          onClick={moveToCurrentPosition}
          className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-20"
        >
          <LocateFixed className="w-6 h-6 text-gray-700" />
        </button>
      </section>
    </main>
  );
}