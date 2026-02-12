'use client';

import { useState, useEffect } from 'react';
import { TMAP_OPTIONS } from '@/constants/routeOptions';
import { TmapCarRouteResponse, TmapPoi } from '../type';
import { searchPoi } from '../api';
import { useDebounce } from '@/hooks/useDebounce';

interface RouteMenuProps {
    // 부모로부터 제어받는 상태들
    startPoint: { display: string; value: string };
    setStartPoint: (val: { display: string; value: string }) => void;
    endPoint: { display: string; value: string };
    setEndPoint: (val: { display: string; value: string }) => void;

    carRoutes: TmapCarRouteResponse[];
    selectedIdx: number;
    loading: boolean;
    onSearch: (start: string, end: string) => void;
    onSelect: (idx: number) => void;
    getThemeColor: (idx: number, route: any) => string;
}

export default function RouteMenu({
    startPoint,
    setStartPoint,
    endPoint,
    setEndPoint,
    carRoutes,
    selectedIdx,
    loading,
    onSearch,
    onSelect,
    getThemeColor,
}: RouteMenuProps) {
    const [startResults, setStartResults] = useState<TmapPoi[]>([]);
    const [endResults, setEndResults] = useState<TmapPoi[]>([]);
    const [activeInput, setActiveInput] = useState<'start' | 'end' | null>(null);

    const debouncedStart = useDebounce(startPoint.display, 300);
    const debouncedEnd = useDebounce(endPoint.display, 300);

    useEffect(() => {
        if (activeInput !== 'start') return;
        if (debouncedStart.length >= 2) {
            searchPoi(debouncedStart).then(setStartResults);
        } else {
            setStartResults([]);
        }
    }, [debouncedStart, activeInput]);

    useEffect(() => {
        if (activeInput !== 'end') return;
        if (debouncedEnd.length >= 2) {
            searchPoi(debouncedEnd).then(setEndResults);
        } else {
            setEndResults([]);
        }
    }, [debouncedEnd, activeInput]);

    const handleSelectPlace = (type: 'start' | 'end', place: TmapPoi) => {
        const selectedData = { display: place.name, value: place.fullAddress };
        setActiveInput(null);

        if (type === 'start') {
            setStartPoint(selectedData);
            setStartResults([]);
        } else {
            setEndPoint(selectedData);
            setEndResults([]);
        }
    };

    const handleSearchClick = () => {
        console.log("@검색 클릭 : ", startPoint, endPoint);
        const startFinal = startPoint.value ? `${startPoint.value} ${startPoint.display}` : startPoint.display;
        const endFinal = endPoint.value ? `${endPoint.value} ${endPoint.display}` : endPoint.display;
        onSearch(startFinal, endFinal);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* 상단 검색 영역 (기존 디자인 유지) */}
            <div className="p-6 bg-slate-900 text-white space-y-4">
                <div className="space-y-3">
                    {/* 출발지 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="출발지"
                            className="w-full p-3 bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={startPoint.display}
                            onChange={(e) => {
                                setActiveInput('start');
                                setStartPoint({ display: e.target.value, value: '' });
                            }}
                        />
                        {startResults.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-white text-slate-800 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto border border-slate-200">
                                {startResults.map((poi, i) => (
                                    <li key={i} onClick={() => handleSelectPlace('start', poi)} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-none">
                                        <div className="font-bold text-sm text-slate-900">{poi.name}</div>
                                        <div className="text-[11px] text-slate-500 truncate">{poi.fullAddress}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 도착지 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="도착지"
                            className="w-full p-3 bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={endPoint.display}
                            onChange={(e) => {
                                setActiveInput('end');
                                setEndPoint({ display: e.target.value, value: '' });
                            }}
                        />
                        {endResults.length > 0 && (
                            <ul className="absolute w-full mt-1 bg-white text-slate-800 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto border border-slate-200">
                                {endResults.map((poi, i) => (
                                    <li key={i} onClick={() => handleSelectPlace('end', poi)} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-none">
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
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl font-bold transition-all"
                >
                    {loading ? '안심 경로 계산 중...' : '경로 검색'}
                </button>
            </div>

            {/* 하단 경로 리스트 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {carRoutes.map((route, idx) => {
                    const info = route.features[0].properties;
                    const isSelected = selectedIdx === idx;
                    const themeColor = getThemeColor(idx, route);

                    return (
                        <div
                            key={idx}
                            onClick={() => onSelect(idx)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected ? 'bg-white shadow-md' : 'bg-white/50 border-transparent'}`}
                            style={{ borderColor: isSelected ? themeColor : 'transparent' }}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>
                                    {TMAP_OPTIONS[idx]?.name || '추천 경로'} {route.isAnsimBest && " 🛡️"}
                                </span>
                                <span className="text-lg font-black text-slate-800">{Math.floor(info.totalTime! / 60)}분</span>
                            </div>
                            <div className="text-xs text-slate-500">{(info.totalDistance! / 1000).toFixed(1)}km · 약 {info.taxiFare?.toLocaleString()}원</div>
                        </div>
                    );
                })}

                {!loading && carRoutes.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20 text-center">
                        <p className="text-sm font-medium leading-relaxed">경로를 검색해 보세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}