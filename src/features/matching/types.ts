/**
 * 부메랑 신청 온보딩에서 선택하는 역할.
 * 이 값에 따라 이후 온보딩 단계(질문/입력 항목)가 서포터즈용/유학생용으로 갈린다.
 */
export type MatchingRole = "supporter" | "student";

export type MatchingGender = "male" | "female" | "unspecified";

export type MatchingNationality =
  | "vietnam"
  | "china"
  | "korea"
  | "nepal"
  | "indonesia";
