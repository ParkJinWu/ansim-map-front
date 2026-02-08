export interface MemberResponse {
  email: string;
  name: string;
  profileImageUrl: string;
  role: string;
}

export interface ProfileUpdateDto {
  name: string;
  email: string;
  profileImageUrl: string;
}