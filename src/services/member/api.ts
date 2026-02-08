import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/common";
import { MemberResponse, ProfileUpdateDto } from "./type";

// 특정 ID로 프로필 조회
export const getMemberProfile = async (memberId: number): Promise<MemberResponse> => {
  const { data } = await apiClient.get<ApiResponse<MemberResponse>>(`/api/member/${memberId}`);
  return data.data;
};

// 프로필 수정
export const updateMemberProfile = async (body: ProfileUpdateDto): Promise<MemberResponse> => {
  const { data } = await apiClient.patch<ApiResponse<MemberResponse>>("/api/member/profile", body);
  return data.data;
};