export interface FavoriteResponse {
  id: number;
  poiId: string;  // Tmap의 고유 ID
  alias: string;
  addressName: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

export interface FavoriteRequest {
  poiId: string;
  alias: string;
  addressName: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

export type FavoriteUpdateDto = Partial<FavoriteRequest>;