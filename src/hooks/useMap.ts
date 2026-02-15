'use client';

import { useState, useCallback } from 'react';
import { TmapCarRouteResponse, TmapFeature } from '@/services/route/type';
import { FavoriteResponse } from '@/services/favorite/type';
import { favoriteMarkerContent, currentLocationMarkerContent, routePointMarkerContent } from '@/services/favorite/utils/markerTemplates';



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

        // 1. 기존 요소 제거 (선 + 마커)
        currentLines.forEach((item) => item.setMap(null));
        const newItems: any[] = [];
        const bounds = new window.kakao.maps.LatLngBounds();

        // 전체 경로의 좌표들을 모을 배열 (시작/끝점 추출용)
        const allCoords: any[] = [];

        data.features.forEach((feature: TmapFeature) => {
            if (feature.geometry.type === "LineString") {
                const linePath = feature.geometry.coordinates.map((coord: [number, number]) => {
                    const pos = new window.kakao.maps.LatLng(coord[1], coord[0]);
                    bounds.extend(pos);
                    allCoords.push(pos); // 모든 좌표 수집
                    return pos;
                });

                // 외곽선과 메인선 그리기 (이전 단계에서 했던 리팩토링 로직)
                const outline = new window.kakao.maps.Polyline({
                    path: linePath,
                    strokeWeight: 11,
                    strokeColor: '#FFFFFF',
                    strokeOpacity: 0.7,
                    lineJoin: 'round',
                    lineCap: 'round',
                });

                const mainLine = new window.kakao.maps.Polyline({
                    path: linePath,
                    strokeWeight: 4,
                    strokeColor: color,
                    lineJoin: 'round',
                    lineCap: 'round',
                });

                outline.setMap(map);
                mainLine.setMap(map);
                newItems.push(outline, mainLine);
            }
        });

        // 2. 출발지/도착지 마커 추가
        if (allCoords.length > 0) {
            const startPos = allCoords[0];
            const endPos = allCoords[allCoords.length - 1];

            // 출발 마커
            const startMarker = new window.kakao.maps.CustomOverlay({
                position: startPos,
                content: routePointMarkerContent('start'),
                yAnchor: 1 // 마커의 발끝이 좌표에 오도록 설정
            });

            // 도착 마커
            const endMarker = new window.kakao.maps.CustomOverlay({
                position: endPos,
                content: routePointMarkerContent('end'),
                yAnchor: 1
            });

            startMarker.setMap(map);
            endMarker.setMap(map);
            newItems.push(startMarker, endMarker);
        }

        setCurrentLines(newItems); // 관리 리스트 업데이트
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