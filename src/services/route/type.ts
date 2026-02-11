// services/route/type.ts
export interface TmapCarRouteResponse {
  type: "FeatureCollection";
  features: TmapFeature[];
  isAnsimBest?: boolean;
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
  name: string;           // 장소명
  upperAddrName: string;  // 시/도
  middleAddrName: string; // 구/군
  lowerAddrName: string;  // 동/읍/면
  frontLat: string;       // 위도
  frontLon: string;       // 경도
  fullAddress: string;    // 백엔드에서 합쳐준 전체 주소
}