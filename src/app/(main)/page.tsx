'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function AnsimMapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [transitPaths, setTransitPaths] = useState<any[]>([]); // ODsay 결과
  const [currentLines, setCurrentLines] = useState<any[]>([]); // 지도에 그려진 선들

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

  // 🚀 ODsay 데이터로 지도에 경로 그리기
  const drawTransitRoute = (path: any) => {
    if (!map) return;

    // 기존 선 지우기
    currentLines.forEach(line => line.setMap(null));
    const newLines: any[] = [];
    const bounds = new window.kakao.maps.LatLngBounds();

    path.subPath.forEach((sub: any) => {
      if (sub.trafficType === 3) return; // 도보 제외

      const linePath = sub.passStopList.stations.map((s: any) => {
        const pos = new window.kakao.maps.LatLng(s.y, s.x);
        bounds.extend(pos);
        return pos;
      });

      const color = sub.trafficType === 1 ? '#3c5da1' : '#34b344'; // 지하철 남색, 버스 초록

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

  // 🚀 ODsay API 호출
  const handleSearch = async () => {
    setLoading(true);
    try {
      // 서울역 -> 강남역 좌표 예시
      const sx = "126.97060"; const sy = "37.55467";
      const ex = "127.0276";  const ey = "37.4979";
      
      const res = await fetch(`/api/odsay?sx=${sx}&sy=${sy}&ex=${ex}&ey=${ey}`);
      const data = await res.json();
      
      if (data.result && data.result.path) {
        setTransitPaths(data.result.path);
      } else {
        alert("경로를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error(err);
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

      {/* 1. 왼쪽 길찾기 사이드바 UI */}
      <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-white border-r border-slate-200">
        <div className="p-6 bg-sky-600">
          <h1 className="text-white text-xl font-black mb-6 flex items-center gap-2">
            🛡️ ANSIM MAP
          </h1>
          
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

          <button 
            onClick={handleSearch}
            className="w-full mt-6 py-4 bg-white text-sky-600 rounded-2xl font-black hover:bg-sky-50 transition-all shadow-xl active:scale-95"
          >
            {loading ? '안전 경로 계산 중...' : '대중교통 길찾기 🔍'}
          </button>
        </div>

        {/* 2. 검색 결과 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {transitPaths.map((path, idx) => (
            <div 
              key={idx}
              onClick={() => drawTransitRoute(path)}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 cursor-pointer hover:border-sky-400 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{path.info.totalTime}</span>
                  <span className="text-sm font-bold text-slate-500">분</span>
                </div>
                <span className="text-xs font-bold text-sky-500 bg-sky-50 px-2 py-1 rounded-lg">추천 경로</span>
              </div>

              <div className="text-sm text-slate-400 mb-4 flex gap-2 font-medium">
                <span>도보 {path.info.totalWalk}m</span>
                <span>•</span>
                <span>{path.info.payment.toLocaleString()}원</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {path.subPath.map((sub: any, sIdx: number) => (
                  <div key={sIdx} className="flex items-center gap-1">
                    {sub.trafficType === 1 && (
                      <span className="px-2 py-1 bg-indigo-500 text-white text-[10px] rounded-md font-bold">
                        {sub.lane[0].name}
                      </span>
                    )}
                    {sub.trafficType === 2 && (
                      <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] rounded-md font-bold">
                        {sub.lane[0].busNo}번
                      </span>
                    )}
                    {sIdx < path.subPath.length - 1 && <span className="text-slate-300">→</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 3. 메인 지도 영역 */}
      <section className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />
      </section>
    </main>
  );
}