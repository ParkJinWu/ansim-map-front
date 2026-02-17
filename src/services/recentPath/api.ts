import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { RecentPathResponse, RecentPathRequest } from "./type";

// 최근 경로 목록 조회
export const getRecentPaths = async (): Promise<RecentPathResponse[]> => {
  const { data } = await apiClient.get<ApiResponse<RecentPathResponse[]>>("/api/recent-paths");
  return data.data;
};

// 최근 경로 저장
export const addRecentPath = async (body: RecentPathRequest): Promise<void> => {
  await apiClient.post<ApiResponse<null>>("/api/recent-paths", body);
};

// 최근 경로 개별 삭제
export const deleteRecentPath = async (id: number): Promise<void> => {
  await apiClient.delete<ApiResponse<null>>(`/api/recent-paths/${id}`);
};

// 최근 경로 전체 삭제
export const deleteAllRecentPaths = async (): Promise<void> => {
  await apiClient.delete<ApiResponse<null>>("/api/recent-paths");
};