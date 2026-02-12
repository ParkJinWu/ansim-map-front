'use client';

import { useState, useCallback } from 'react';
import { TmapCarRouteResponse, TmapFeature } from '@/services/route/type';
import { map } from 'zod';

export const useMap = () => {
    const [map, setMap] = useState<any>(null);
    const [currentLines, setCurrentLines] = useState<any[]>([]);

    // 1. initMap이 HTMLDivElement를 받도록 수정
    const initMap = useCallback((container: HTMLDivElement) => {
        if (!container) return; // 컨테이너가 없으면 중단

        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 5,
            };
            // 카카오 맵 생성
            const newMap = new window.kakao.maps.Map(container, options);
            setMap(newMap);
        });
    }, []); // 의존성 배열 비움

    // 2. drawRoute 로직은 그대로 유지
    const drawRoute = useCallback((data: TmapCarRouteResponse, color: string) => {
        if (!map) return;

        currentLines.forEach((line) => line.setMap(null));
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
    }, [map, currentLines]);

    // 3. 지도 중심 이동 및 확대 함수 추가
    const moveMap = useCallback((lat: string | number, lon: string | number) => {
        if (!map) return;

        const moveLatLon = new window.kakao.maps.LatLng(Number(lat), Number(lon));

        // 지도를 부드럽게 이동시킵니다.
        map.panTo(moveLatLon);
        // 상세 정보이므로 줌 레벨을 좀 더 가깝게(예: 3) 조절합니다.
        map.setLevel(3);
    }, [map]);

    return { map, initMap, drawRoute, moveMap };
};