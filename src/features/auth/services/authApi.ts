import { api } from "../../../lib/api";

/**
 * 카카오 accessToken을 백엔드로 보내 우리 서비스 JWT로 교환한다.
 *
 * 로그인 흐름(CLAUDE.md):
 *   프론트 login() → 카카오 accessToken 획득 → 백엔드로 전송
 *   → 백엔드가 kapi.kakao.com으로 검증 후 서비스 JWT 발급
 */

// TODO(백엔드 확인): 실제 로그인 엔드포인트 경로를 백엔드팀과 확정할 것
const KAKAO_LOGIN_ENDPOINT = "/api/auth/login/kakao";

export type KakaoLoginResponse = {
  // TODO(백엔드 확인): 실제 응답 스키마에 맞게 필드 수정
  accessToken: string;
  refreshToken?: string;
  userId: Number;
  nickname: string;
};

export const loginWithKakaoToken = async (
  kakaoAccessToken: string,
): Promise<KakaoLoginResponse> => {
  const { data } = await api.post<KakaoLoginResponse>(KAKAO_LOGIN_ENDPOINT, {
    kakaoAccessToken,
  });
  return data;
};
