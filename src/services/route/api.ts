import { apiClient } from "@/lib/axios";
import { TmapCarRouteResponse } from "./type";

export const getCarPath = async (params: {
  sx: string;
  sy: string;
  ex: string;
  ey: string;
}): Promise<TmapCarRouteResponse[]> => { 
  const { data } = await apiClient.get<TmapCarRouteResponse[]>("/api/v1/tmap/path/car", {
    params,
  });
  return data;
};