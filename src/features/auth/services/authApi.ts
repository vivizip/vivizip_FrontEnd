import { api } from "../../../lib/api";

/**
 * 카카오 accessToken을 백엔드로 보내 우리 서비스 JWT로 교환한다.
 *
 * 로그인 흐름(CLAUDE.md):
 *   프론트 login() → 카카오 accessToken 획득 → 백엔드로 전송
 *   → 백엔드가 kapi.kakao.com으로 검증 후 서비스 JWT 발급
 */

// 실제 로그인 엔드포인트 경로
const KAKAO_LOGIN_ENDPOINT = "/api/auth/login/kakao";

export type KakaoLoginResponse = {
  // 응답 스키마
  accessToken: string;
  refreshToken?: string;
  userId: number;
  nickname: string;
};

export const loginWithKakaoToken = async (
  kakaoAccessToken: string,
): Promise<KakaoLoginResponse> => {
  console.log("[Auth API] Sending to backend:", {
    endpoint: KAKAO_LOGIN_ENDPOINT,
    baseURL: api.defaults.baseURL,
    payload: { kakaoAccessToken },
  });
  const { data } = await api.post<KakaoLoginResponse>(KAKAO_LOGIN_ENDPOINT, {
    kakaoAccessToken,
  });
  console.log("[Auth API] Response from backend:", data);
  return data;
};
