export interface FavoriteResponse {
  id: number;
  alias: string;
  addressName: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

export interface FavoriteRequest {
  alias: string;
  addressName: string;
  placeName: string;
  latitude: number;
  longitude: number;
}

export type FavoriteUpdateDto = Partial<FavoriteRequest>;