'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    Phone,
    Clock,
    MapPin,
    Navigation,
    Info
} from 'lucide-react';
import { searchPoi } from '@/services/route/api';
import { getPoiDetail } from '@/services/plcae/api';
import { TmapPoi } from '@/services/route/type';
import { useDebounce } from '@/hooks/useDebounce';

interface PlaceMenuProps {
    onMoveMap: (lat: string, lon: string) => void;
    onSetRoute: (type: 'start' | 'end', place: any) => void;
}

export default function PlaceMenu({ onMoveMap, onSetRoute }: PlaceMenuProps) {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<TmapPoi[]>([]);
    const [selectedPlace, setSelectedPlace] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const debouncedKeyword = useDebounce(keyword, 300);

    useEffect(() => {
        if (debouncedKeyword.length >= 2 && !selectedPlace) {
            searchPoi(debouncedKeyword).then((res) => {
                setResults(Array.isArray(res) ? res : []);
            }).catch(() => setResults([]));
        } else if (debouncedKeyword.length < 2) {
            setResults([]);
        }
    }, [debouncedKeyword, selectedPlace]);

    const handleDetail = async (poiId: string) => {
        setLoading(true);
        try {
            const detail = await getPoiDetail(poiId);
            setSelectedPlace(detail);
            if (detail?.lat && detail?.lon) {
                onMoveMap(detail.lat, detail.lon);
            }
        } catch (error) {
            console.error("상세 정보 로드 실패", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        // 전체 배경을 아주 연한 스카이 블루 톤으로 설정
        <div className="flex flex-col h-full bg-[#f0f9ff]"> 
            {/* 1. 검색창 영역 */}
            {!selectedPlace && (
                <div className="p-5 border-b border-sky-100">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                        <input
                            type="text"
                            placeholder="어디로 갈까요?"
                            className="w-full pl-11 pr-4 py-4 bg-white border-2 border-sky-100 rounded-2xl text-sm text-slate-700 placeholder:text-sky-300 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-sm"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                {selectedPlace ? (
                    /* 2. 장소 상세 정보 영역 */
                    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-5">
                        <button
                            onClick={() => setSelectedPlace(null)}
                            className="text-xs font-bold text-sky-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            목록으로
                        </button>

                        <div className="bg-white p-5 rounded-3xl shadow-md shadow-sky-100 border border-sky-50">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white bg-sky-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Place
                                </span>
                                <span className="text-xs text-sky-300 font-medium">
                                    {selectedPlace.bizName || selectedPlace.middleBizName || "정보"}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mt-2 leading-tight">{selectedPlace.name}</h2>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-sky-400" />
                                <span>{selectedPlace.address}</span>
                            </div>
                        </div>

                        <div className="space-y-4 px-2">
                            {selectedPlace.tel && (
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-sky-500" />
                                    </div>
                                    <span className="text-slate-600 font-medium">{selectedPlace.tel}</span>
                                </div>
                            )}

                            {selectedPlace.additionalInfo && (
                                <div className="flex items-start gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-4 h-4 text-sky-500" />
                                    </div>
                                    <div className="text-slate-500 text-xs leading-relaxed pt-1">
                                        {selectedPlace.additionalInfo.split(';').filter(Boolean).map((info: string, i: number) => (
                                            <div key={i}>{info.trim()}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => onSetRoute('start', selectedPlace)}
                                className="flex-1 py-4 bg-white text-sky-600 rounded-2xl font-bold hover:bg-sky-50 border-2 border-sky-100 transition-all active:scale-95"
                            >
                                출발지로
                            </button>
                            <button
                                onClick={() => onSetRoute('end', selectedPlace)}
                                className="flex-1 py-4 bg-sky-400 text-white rounded-2xl font-bold hover:bg-sky-500 shadow-lg shadow-sky-200 transition-all active:scale-95"
                            >
                                도착지로
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 3. 검색 결과 리스트 */
                    <ul className="p-4 space-y-3">
                        {results.map((poi, i) => (
                            <li
                                key={i}
                                onClick={() => handleDetail(poi.id)}
                                className="p-5 bg-white hover:bg-sky-50 cursor-pointer transition-all group rounded-2xl flex justify-between items-center shadow-sm border border-sky-50 hover:border-sky-200"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-slate-800 group-hover:text-sky-600 truncate transition-colors">
                                        {poi.name}
                                    </div>
                                    <div className="text-[11px] text-sky-300 mt-1 truncate">{poi.fullAddress}</div>
                                </div>
                                <ChevronLeft className="w-5 h-5 text-sky-100 rotate-180 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}