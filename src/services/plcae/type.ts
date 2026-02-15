export interface TmapPoi {
  id: string;             // 상세 조회를 위한 필수 키
  name: string;           // 장소명
  upperAddrName: string;  // 시/도
  middleAddrName: string; // 구/군
  lowerAddrName: string;  // 동/읍/면
  frontLat: string;       // 위도
  frontLon: string;       // 경도
  fullAddress: string;    // 전체 주소
}

// 상세 정보 API 응답 타입 (getPoiDetail용)
export interface TmapPoiDetail {
  id: string;
  name: string;
  address: string;        // 전체 주소
  firstNo ?: string;       // 본번
  secondNo ?: string;      // 부번
  bizName: string;        // 업종명 (ex: 편의점, 카페)
  upperBizName?: string;  // 업종 대분류
  middleBizName?: string; // 업종 중분류
  tel: string;            // 전화번호
  lat: string;            // 위도 (상세 API의 좌표 필드명 확인 필요)
  lon: string;            // 경도
  desc?: string;          // 장소 설명
  additionalInfo?: string; // 기타 정보 (주차 등)
}