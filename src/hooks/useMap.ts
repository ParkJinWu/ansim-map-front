'use client';

import { useState, useCallback } from 'react';
import { TmapCarRouteResponse, TmapFeature } from '@/services/route/type';
import { FavoriteResponse } from '@/services/favorite/type';
import { favoriteMarkerContent, currentLocationMarkerContent } from '@/services/favorite/utils/markerTemplates';



export const useMap = () => {
    const [map, setMap] = useState<any>(null);
    const [currentLines, setCurrentLines] = useState<any[]>([]);
    // 즐겨찾기 마커 상태
    const [favoriteMarkers, setFavoriteMarkers] = useState<any[]>([]);
    const [currentLocationOverlay, setCurrentLocationOverlay] = useState<any>(null); // 내 위치 오버레이 상태

    const initMap = useCallback((container: HTMLDivElement) => {
        if (!container) return;

        window.kakao.maps.load(() => {
            const options = {
                center: new window.kakao.maps.LatLng(37.5665, 126.9780),
                level: 5,
            };
            const newMap = new window.kakao.maps.Map(container, options);
            setMap(newMap);
        });
    }, []);

    // 즐겨찾기 마커 표시
    const displayFavoriteMarkers = useCallback((favorites: FavoriteResponse[]) => {
        if (!map) return;

        setFavoriteMarkers((prevMarkers) => {
            prevMarkers.forEach((m) => m.setMap(null));

            const newMarkers = favorites.map((fav) => {
                const position = new window.kakao.maps.LatLng(fav.latitude, fav.longitude);

                // 분리된 템플릿 함수 사용
                const content = favoriteMarkerContent(fav);

                const overlay = new window.kakao.maps.CustomOverlay({
                    position: position,
                    content: content,
                    clickable: true // HTML 내부 클릭 이벤트 허용
                });

                overlay.setMap(map);
                return overlay;
            });

            return newMarkers;
        });
    }, [map]);

    const moveToCurrentPosition = useCallback(() => {
        if (!map) return;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const locPosition = new window.kakao.maps.LatLng(lat, lon);

                    // 1. 지도 이동
                    map.panTo(locPosition);
                    map.setLevel(3);

                    // 2. 내 위치 마커(오버레이) 표시
                    if (currentLocationOverlay) {
                        // 이미 있다면 위치만 이동
                        currentLocationOverlay.setPosition(locPosition);
                        currentLocationOverlay.setMap(map);
                    } else {
                        // 없다면 새로 생성
                        const overlay = new window.kakao.maps.CustomOverlay({
                            position: locPosition,
                            content: currentLocationMarkerContent(),
                            zIndex: 10
                        });
                        overlay.setMap(map);
                        setCurrentLocationOverlay(overlay);
                    }
                },
                (error) => alert("위치 정보를 허용해주세요.")
            );
        }
    }, [map, currentLocationOverlay]);

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

    const moveMap = useCallback((lat: string | number, lon: string | number) => {
        if (!map) return;
        const moveLatLon = new window.kakao.maps.LatLng(Number(lat), Number(lon));
        map.panTo(moveLatLon);
        map.setLevel(3);
    }, [map]);


    return { map, initMap, drawRoute, moveMap, displayFavoriteMarkers, moveToCurrentPosition };
};