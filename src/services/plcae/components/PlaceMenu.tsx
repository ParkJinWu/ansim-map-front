'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    Phone,
    Clock,
    MapPin,
    ShieldCheck,
    Navigation
} from 'lucide-react'; // 아이콘 임포트
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
                // API 응답이 배열이면 그대로 넣고, 아니면 빈 배열로 초기화
                setResults(Array.isArray(res) ? res : []);
            }).catch(() => setResults([])); // 에러 발생 시에도 빈 배열로
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
        <div className="flex flex-col h-full bg-white">
            {/* 1. 검색창 영역 */}
            {!selectedPlace && (
                <div className="p-5 border-b border-slate-50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="장소, 주소 검색"
                            className="w-full pl-11 pr-4 py-4 bg-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                            className="text-xs font-bold text-slate-400 hover:text-blue-500 flex items-center gap-1 transition-colors group"
                        >
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            검색 목록으로 돌아가기
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    Place
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                    {selectedPlace.bizName || selectedPlace.middleBizName || "정보"}
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mt-2 leading-tight">{selectedPlace.name}</h2>
                            <div className="flex items-center gap-1 text-sm text-slate-500 mt-2">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{selectedPlace.address}</span>
                            </div>
                        </div>

                        <div className="space-y-4 py-6 border-y border-slate-50">
                            {/* 전화번호 */}
                            {selectedPlace.tel && (
                                <div className="flex items-start gap-3 text-sm">
                                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <span className="text-slate-700 font-medium">{selectedPlace.tel}</span>
                                </div>
                            )}

                            {/* 영업시간 */}
                            {selectedPlace.additionalInfo && (
                                <div className="flex items-start gap-3 text-sm">
                                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div className="text-slate-600 text-xs leading-relaxed">
                                        {selectedPlace.additionalInfo.split(';').filter(Boolean).map((info: string, i: number) => (
                                            <div key={i} className="mb-0.5">{info.trim()}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 하단 버튼 제어 */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => onSetRoute('start', selectedPlace)}
                                className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Navigation className="w-4 h-4 text-slate-600" />
                                출발지로
                            </button>
                            <button
                                onClick={() => onSetRoute('end', selectedPlace)}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                            >
                                도착지로
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 3. 검색 결과 리스트 */
                    <ul className="divide-y divide-slate-50 px-2">
                        {results.map((poi, i) => (
                            <li
                                key={i}
                                onClick={() => handleDetail(poi.id)}
                                className="p-5 hover:bg-blue-50 cursor-pointer transition-all group rounded-xl flex justify-between items-center"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                                        {poi.name}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-1 truncate">{poi.fullAddress}</div>
                                </div>
                                <ChevronLeft className="w-4 h-4 text-slate-200 rotate-180 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}