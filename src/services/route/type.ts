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