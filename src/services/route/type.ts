// services/route/type.ts
export interface TmapCarRouteResponse {
  type: "FeatureCollection";
  features: TmapFeature[];
  isAnsimBest?: boolean;
  startLat: string; // 출발지 위도
  startLon: string; // 출발지 경도
  endLat: string;   // 목적지 위도
  endLon: string;   // 목적지 경도
}

// Point 정보 타입 정의
export interface PointState {
    display: string; // 화면에 보여줄 이름
    value: string;   // 실제 주소
    lat?: string;    // 위도 (POI 선택 시에만 존재)
    lon?: string;    // 경도 (POI 선택 시에만 존재)
}

export interface TmapFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString";
    coordinates: any; // Point면 [number, number], LineString이면 [number, number][]
  };
  properties: {
    totalTime?: number;
    totalDistance?: number;
    taxiFare?: number;
    name?: string;
    description?: string;
    index?: number;
  };
}

export interface TmapPoi {
  id: string;
  name: string;           // 장소명
  upperAddrName: string;  // 시/도
  middleAddrName: string; // 구/군
  lowerAddrName: string;  // 동/읍/면
  frontLat: string;       // 위도
  frontLon: string;       // 경도
  fullAddress: string;    // 백엔드에서 합쳐준 전체 주소
}