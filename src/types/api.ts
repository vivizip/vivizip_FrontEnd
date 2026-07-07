/**
 * 백엔드 에러 응답 봉투(envelope).
 * 성공(2xx)은 데이터가 봉투 없이 평평하게 오고, 실패(4xx/5xx)만 이 구조로 온다.
 * (2026-07-07 로그인 API 실측: 200은 평평한 구조, 401은 아래 봉투)
 *
 * 예시:
 *   { "isSuccess": false, "code": 4360, "message": "유효하지 않은 인증 코드입니다...", "result": null }
 */
export type ApiEnvelope<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  result: T | null;
};
