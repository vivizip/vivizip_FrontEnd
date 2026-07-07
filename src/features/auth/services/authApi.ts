import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

/**
 * 카카오 accessToken을 백엔드로 보내 우리 서비스 JWT로 교환한다.
 *
 * 로그인 흐름(CLAUDE.md):
 *   프론트 login() → 카카오 accessToken 획득 → 백엔드로 전송
 *   → 백엔드가 kapi.kakao.com으로 검증 후 서비스 JWT 발급
 */

// 실제 로그인 엔드포인트 경로
const KAKAO_LOGIN_ENDPOINT = "/api/auth/login/kakao";

// 성공 응답은 봉투 없이 평평한 구조로 온다 (2026-07-07 실제 응답으로 확인)
export type KakaoLoginResponse = {
  accessToken: string;
  refreshToken: string;
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
  try {
    const { data } = await api.post<KakaoLoginResponse>(KAKAO_LOGIN_ENDPOINT, {
      kakaoAccessToken,
    });
    console.log("[Auth API] Response from backend:", data);
    return data;
  } catch (err) {
    // 실패 응답(4xx/5xx)만 봉투 구조로 오므로, 봉투에서 백엔드 메시지를 꺼내 노출한다
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<never> | undefined;
      if (envelope?.message) {
        throw new Error(envelope.message);
      }
    }
    throw err;
  }
};
