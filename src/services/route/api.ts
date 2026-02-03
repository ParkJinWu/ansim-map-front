import { apiClient } from "@/lib/axios";
import { TmapRouteResponse, RouteRequestParams, TmapItinerary } from "./type";

export const getTransitPath = async (params: RouteRequestParams): Promise<TmapItinerary[]> => {
  const { data } = await apiClient.get<TmapRouteResponse>("api/v1/path/transit", {
    params
  });

  return data.metaData.plan.itineraries;
};