'use client';

import { useState, useEffect } from 'react';
import { TMAP_OPTIONS } from '@/constants/routeOptions';
import { TmapCarRouteResponse, TmapPoi } from '../type';
import { searchPoi } from '../api';
import { useDebounce } from '@/hooks/useDebounce';

interface RouteMenuProps {
    carRoutes: TmapCarRouteResponse[];
    selectedIdx: number;
    loading: boolean;
    onSearch: (start: string, end: string) => void;
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
    // 1. 상태 관리: display(화면 표시용 이름), value(백엔드 전송용 상세 주소)
    const [startPoint, setStartPoint] = useState({ display: '', value: '' });
    const [endPoint, setEndPoint] = useState({ display: '', value: '' });

    const [startResults, setStartResults] = useState<TmapPoi[]>([]);
    const [endResults, setEndResults] = useState<TmapPoi[]>([]);

    const debouncedStart = useDebounce(startPoint.display, 300);
    const debouncedEnd = useDebounce(endPoint.display, 300);

    // 선택 중인지 확인하는 상태
    const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);

    // 실시간 POI 검색
    // 출발지 검색 useEffect
    useEffect(() => {
        // 사용자가 'start' 필드를 직접 건드리고 있을 때만 검색 실행
        if (activeInput !== 'start') return;

        if (debouncedStart.length >= 2) {
            searchPoi(debouncedStart).then(setStartResults);
        } else {
            setStartResults([]);
        }
    }, [debouncedStart, activeInput]);

    // 도착지 검색 useEffect
    useEffect(() => {
        // 사용자가 'end' 필드를 직접 건드리고 있을 때만 검색 실행
        if (activeInput !== 'end') return;

        if (debouncedEnd.length >= 2) {
            searchPoi(debouncedEnd).then(setEndResults);
        } else {
            setEndResults([]);
        }
    }, [debouncedEnd, activeInput]);

    // 장소 선택 핸들러: 이름과 상세 주소를 각각 저장
    const handleSelectPlace = (type: 'start' | 'end', place: TmapPoi) => {
        const selectedData = { display: place.name, value: place.fullAddress };

        // 선택 시 activeInput을 null로 만들어 useEffect의 추가 실행을 원천 봉쇄
        setActiveInput(null);

        if (type === 'start') {
            setStartPoint(selectedData);
            setStartResults([]);
        } else {
            setEndPoint(selectedData);
            setEndResults([]);
        }
    };

    // 검색 실행 로직: 상세주소 + 장소명을 조합하여 전송
    const handleSearchClick = () => {
        const startFinal = startPoint.value
            ? `${startPoint.value} ${startPoint.display}`
            : startPoint.display;

        const endFinal = endPoint.value
            ? `${endPoint.value} ${endPoint.display}`
            : endPoint.display;

        onSearch(startFinal, endFinal);
    };

    return (
        <aside className="w-[380px] h-full shadow-2xl z-30 flex flex-col bg-white border-r">
            {/* 1. 상단 검색 영역 */}
            <div className="p-6 bg-slate-900 text-white space-y-4">
                <h1 className="text-xl font-black mb-2 italic tracking-tighter text-blue-400">ANSIM MAP</h1>

                <div className="space-y-3">
                    {/* 출발지 입력 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="출발지 (예: 서울역)"
                            className="w-full p-3 bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={startPoint.display}
                            onChange={(e) => {
                                setActiveInput('start'); // 사용자가 직접 타이핑할 때만 'start'로 설정
                                setStartPoint({ display: e.target.value, value: '' });
                            }}
                        />
                        {startResults.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-white text-slate-800 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto border border-slate-200">
                                {startResults.map((poi, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSelectPlace('start', poi)}
                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                                    >
                                        <div className="font-bold text-sm text-slate-900">{poi.name}</div>
                                        <div className="text-[11px] text-slate-500 truncate">{poi.fullAddress}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 도착지 입력 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="도착지 (예: 강남역)"
                            className="w-full p-3 bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={endPoint.display}
                            onChange={(e) => {
                                setActiveInput('end'); // 사용자가 직접 타이핑할 때만 'end'로 설정
                                setEndPoint({ display: e.target.value, value: '' });
                            }}
                        />
                        {endResults.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-white text-slate-800 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto border border-slate-200">
                                {endResults.map((poi, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSelectPlace('end', poi)}
                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none"
                                    >
                                        <div className="font-bold text-sm text-slate-900">{poi.name}</div>
                                        <div className="text-[11px] text-slate-500 truncate">{poi.fullAddress}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleSearchClick}
                    disabled={loading || !startPoint.display || !endPoint.display}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl font-bold transition-all active:scale-[0.98] mt-2"
                >
                    {loading ? '안심 경로 계산 중...' : '경로 검색'}
                </button>
            </div>

            {/* 2. 하단 경로 리스트 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {carRoutes.map((route, idx) => {
                    const info = route.features[0].properties;
                    const isSelected = selectedIdx === idx;
                    const themeColor = getThemeColor(idx, route);

                    return (
                        <div
                            key={idx}
                            onClick={() => onSelect(idx)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                                ? 'bg-white shadow-md'
                                : 'bg-white/50 border-transparent opacity-70 hover:opacity-100 hover:bg-white'
                                }`}
                            style={{ borderColor: isSelected ? themeColor : 'transparent' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className="text-[10px] font-bold px-2 py-1 rounded"
                                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                >
                                    {TMAP_OPTIONS[idx]?.name || '추천 경로'}
                                    {route.isAnsimBest && " 🛡️"}
                                </span>
                                <span className="text-lg font-black text-slate-800">
                                    {Math.floor(info.totalTime! / 60)}분
                                </span>
                            </div>
                            <div className="text-xs text-slate-500 flex justify-between items-center">
                                <div className="space-x-2 font-medium">
                                    <span className="text-slate-700">{(info.totalDistance! / 1000).toFixed(1)}km</span>
                                    <span>·</span>
                                    <span>약 {info.taxiFare?.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && carRoutes.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-2xl opacity-50">📍</div>
                        <p className="text-sm font-medium leading-relaxed">
                            출발지와 목적지를 입력하고<br />안전한 데이터 기반 경로를 확인하세요.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}