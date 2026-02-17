/**
 * 최근 경로 저장 요청
 */
export interface RecentPathRequest {
  startPlaceName: string;
  startAddressName: string;
  startLatitude: number;
  startLongitude: number;
  
  endPlaceName: string;
  endAddressName: string;
  endLatitude: number;
  endLongitude: number;
}

/**
 * 최근 경로 응답
 */
export interface RecentPathResponse {
  id: number;
  startPlaceName: string;
  startAddressName: string;
  endPlaceName: string;
  endAddressName: string;
  lastUsedAt: string; 
}