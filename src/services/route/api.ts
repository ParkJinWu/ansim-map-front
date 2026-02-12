import { apiClient } from "@/lib/axios";
import { TmapCarRouteResponse, TmapPoi } from "./type";

export const getCarPath = async (payload: {
  startAddr: string;
  endAddr: string;
}): Promise<TmapCarRouteResponse[]> => { 
  const { data } = await apiClient.get<TmapCarRouteResponse[]>("/api/v1/tmap/path/car", {
    params: {
        startAddr: payload.startAddr,
        endAddr: payload.endAddr
    },
  });
  return data;
};
export const searchPoi = async (keyword: string): Promise<TmapPoi[]> => {
  if (!keyword || keyword.trim().length < 2) return []; // 2글자 미만은 요청 안 함
  
  const { data } = await apiClient.get<TmapPoi[]>("/api/v1/tmap/search/poi", {
    params: { keyword },
  });
  return data;
};