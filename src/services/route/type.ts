/**
 * TMAP 대중교통 API 요청 파라미터
 */
export interface RouteRequestParams {
  sx: string; // 출발지 경도 (longitude)
  sy: string; // 출발지 위도 (latitude)
  ex: string; // 도착지 경도
  ey: string; // 도착지 위도
}

/**
 * TMAP 대중교통 API 전체 응답 구조
 */
export interface TmapRouteResponse {
  metaData: {
    plan: {
      itineraries: TmapItinerary[];
    };
  };
}

/**
 * 개별 경로 (하나의 경로 추천)
 */
export interface TmapItinerary {
  totalTime: number;         // 총 소요 시간 (초)
  totalDistance: number;     // 총 거리 (미터)
  totalWalkTime: number;     // 총 도보 시간 (초)
  totalWalkDistance: number; // 총 도보 거리 (미터)
  fare: {
    regular: {
      totalFare: number;     // 총 요금
    };
  };
  legs: TmapLeg[];           // 경로를 구성하는 세부 구간들
}

/**
 * 경로 내의 구간 (도보, 버스, 지하철 등)
 */
export interface TmapLeg {
  mode: 'WALK' | 'BUS' | 'SUBWAY'; // 이동 수단
  sectionTime: number;             // 해당 구간 소요 시간 (초)
  distance: number;                // 해당 구간 거리 (미터)
  start: {
    name: string;                  // 출발지/정류장 명칭
  };
  end: {
    name: string;                  // 도착지/정거장 명칭
  };
  route?: string;                  // 노선 명칭 (버스 번호, 지하철 호선)
  passShape?: string;              // 해당 구간의 전체 이동 좌표 (LineString용)
  steps?: TmapStep[];              // 도보 구간일 경우 상세 안내
}

/**
 * 도보 구간의 상세 안내 (좌회전, 우회전 등)
 */
export interface TmapStep {
  description: string;             // 안내 문구
  linestring: string;              // 해당 단계의 좌표 문자열
}