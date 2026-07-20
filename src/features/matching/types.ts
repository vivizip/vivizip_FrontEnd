/**
 * 부메랑 신청 온보딩에서 선택하는 역할.
 * 이 값에 따라 이후 온보딩 단계(질문/입력 항목)가 서포터즈용/유학생용으로 갈린다.
 */
export type MatchingRole = "supporter" | "student";

// 성별/국적은 GET /api/options/genders, /api/options/nationalities가 내려주는
// code 값을 그대로 쓴다 (고정 목록이 아니라 서버 옵션 목록에 따라 달라짐).
export type MatchingGender = string;

export type MatchingNationality = string;

/** 유학생 분기 - 한국어 대화 편의 수준 */
export type MatchingKoreanLevel = "greeting" | "daily" | "fluent";
