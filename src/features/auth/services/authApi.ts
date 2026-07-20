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
const LOGOUT_ENDPOINT = "/api/tokens/logout";
const MY_PROFILE_ENDPOINT = "/api/users/me";

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

/**
 * 서버에 저장된 refreshToken을 무효화한다.
 * 응답 바디 없이 200 OK만 온다.
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await api.post(LOGOUT_ENDPOINT, { refreshToken });
};

// nationality/language/gender는 예시값(KOREA/KOREAN/MALE)만 확인됐고 전체 enum 목록은
// 아직 미확인이라 string으로 느슨하게 받는다 (다른 값이 오면 화면에서 raw 값을 그대로 보여줌).
export type MyProfileResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImage: string | null;
  role: string;
  language: string;
  nationality: string;
  gender: string;
  schoolId: number | null;
  schoolVerified: boolean;
};

/** 로그인된 사용자의 내 프로필을 조회한다. */
export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const { data } = await api.get<MyProfileResponse>(MY_PROFILE_ENDPOINT);
  return data;
};

/** 회원탈퇴. 서버 계정을 삭제한다 (되돌릴 수 없음). */
export const withdrawAccount = async (): Promise<void> => {
  await api.delete(MY_PROFILE_ENDPOINT);
};
