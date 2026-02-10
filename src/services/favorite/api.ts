import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { FavoriteResponse, FavoriteRequest, FavoriteUpdateDto } from "./type";

/**
 * 즐겨찾기 목록 조회
 */
export const getFavorites = async (): Promise<FavoriteResponse[]> => {
  const { data } = await apiClient.get<ApiResponse<FavoriteResponse[]>>("/api/favorites");
  return data.data;
};

/**
 * 즐겨찾기 추가
 */
export const addFavorite = async (body: FavoriteRequest): Promise<FavoriteResponse> => {
  const { data } = await apiClient.post<ApiResponse<FavoriteResponse>>("/api/favorites", body);
  return data.data;
};

/**
 * 즐겨찾기 수정
 */
export const updateFavorite = async (favoriteId: number, body: FavoriteUpdateDto): Promise<FavoriteResponse> => {
  const { data } = await apiClient.patch<ApiResponse<FavoriteResponse>>(`/api/favorites/${favoriteId}`, body);
  return data.data;
};

/**
 * 즐겨찾기 삭제
 */
export const deleteFavorite = async (favoriteId: number): Promise<void> => {
  const { data } = await apiClient.delete<ApiResponse<void>>(`/api/favorites/${favoriteId}`);
};