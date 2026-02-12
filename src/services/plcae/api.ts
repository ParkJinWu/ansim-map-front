import { apiClient } from "@/lib/axios";
import { TmapPoiDetail } from "./type";


export const getPoiDetail = async (poiId: string): Promise<TmapPoiDetail> => {
  const { data } = await apiClient.get<TmapPoiDetail>(`/api/v1/tmap/search/poi/${poiId}`);
  return data;
};