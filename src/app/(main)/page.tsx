'use client';

import { useRef, useState } from 'react';
import Script from 'next/script';
import { getTransitPath } from '@/services/route/api';
import { TmapItinerary } from '@/services/route/type';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transitPaths, setTransitPaths] = useState<TmapItinerary[]>([]);
  const [currentLines, setCurrentLines] = useState<any[]>([]);

  const initMap = () => {
    window.kakao.maps.load(() => {
      if (!mapContainer.current) return;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 5,
      };
      setMap(new window.kakao.maps.Map(mapContainer.current, options));
    });
  };

  // 🚀 지도에 경로 그리기 (타입 적용)
  const drawTransitRoute = (path: TmapItinerary) => {
    if (!map) return;

    currentLines.forEach(line => line.setMap(null));
    const newLines: any[] = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    path.legs.forEach((leg) => {
      if (!leg.passShape) return;

      const points = leg.passShape.split(" ");
      const linePath = points.map((p: string) => {
        const [lon, lat] = p.split(",");
        const pos = new window.kakao.maps.LatLng(Number(lat), Number(lon));
        bounds.extend(pos);
        return pos;
      });

      let color = '#34b344';
      if (leg.mode === 'SUBWAY') color = '#3c5da1';
      if (leg.mode === 'WALK') color = '#aaaaaa';

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 6,
        strokeColor: color,
        strokeOpacity: 0.8,
      });

      polyline.setMap(map);
      newLines.push(polyline);
    });

    setCurrentLines(newLines);
    map.setBounds(bounds);
  };

  // 🚀 리팩토링된 API 호출 로직
  const handleSearch = async () => {
    setLoading(true);
    try {
      // 1. 서비스 함수 호출 (비즈니스 로직 분리)
      const data = await getTransitPath({
        sx: "126.97060",
        sy: "37.55467",
        ex: "127.0276",
        ey: "37.4979"
      });

      // 2. 응답 데이터 처리 (서비스에서 이미 metaData.plan... 처리를 해서 온다고 가정)
      if (data && data.length > 0) {
        setTransitPaths(data);
      } else {
        alert("경로를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("경로 탐색 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen bg-white flex overflow-hidden text-slate-900">
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT_ID}&autoload=false&libraries=services`}
        onLoad={initMap}
      />

      {/* 사이드바 UI (동일) */}
      <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-white border-r border-slate-200">
        <div className="p-6 bg-sky-600">
          <h1 className="text-white text-xl font-black mb-6 flex items-center gap-2">🛡️ ANSIM MAP</h1>
          <div className="space-y-3">
            <div className="flex items-center bg-sky-700/40 rounded-xl p-3 border border-sky-400/30">
              <span className="w-2 h-2 bg-sky-300 rounded-full mr-3" />
              <input className="bg-transparent text-white placeholder-sky-200 outline-none text-sm w-full" placeholder="출발지: 서울역" readOnly />
            </div>
            <div className="flex items-center bg-sky-700/40 rounded-xl p-3 border border-sky-400/30">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-3" />
              <input className="bg-transparent text-white placeholder-sky-200 outline-none text-sm w-full" placeholder="도착지: 강남역" readOnly />
            </div>
          </div>
          <button onClick={handleSearch} className="w-full mt-6 py-4 bg-white text-sky-600 rounded-2xl font-black hover:bg-sky-50 transition-all shadow-xl active:scale-95">
            {loading ? '안전 경로 계산 중...' : '대중교통 길찾기 🔍'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {transitPaths.map((path, idx) => (
            <div key={idx} onClick={() => drawTransitRoute(path)} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:border-sky-400 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{Math.floor(path.totalTime / 60)}</span>
                  <span className="text-sm font-bold text-slate-500">분</span>
                </div>
                <span className="text-xs font-bold text-sky-500 bg-sky-50 px-2 py-1 rounded-lg">추천 {idx + 1}</span>
              </div>
              <div className="text-sm text-slate-400 mb-4 flex gap-2 font-medium">
                <span>도보 {path.totalWalkDistance}m</span>
                <span>•</span>
                <span>{(path.fare?.regular?.totalFare || 0).toLocaleString()}원</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {path.legs.map((leg, lIdx) => (
                  <div key={lIdx} className="flex items-center gap-1">
                    {leg.mode === 'SUBWAY' && <span className="px-2 py-1 bg-indigo-500 text-white text-[10px] rounded-md font-bold">{leg.route}</span>}
                    {leg.mode === 'BUS' && <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] rounded-md font-bold">{leg.route}번</span>}
                    {lIdx < path.legs.length - 1 && leg.mode !== 'WALK' && <span className="text-slate-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
      </section>
    </main>
  );
}