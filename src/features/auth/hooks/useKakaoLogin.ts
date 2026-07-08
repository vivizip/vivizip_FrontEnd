import { useCallback, useState } from "react";
import { login } from "@react-native-seoul/kakao-login";

import { saveTokens } from "../../../lib/tokenStorage";
import {
  loginWithKakaoToken,
  type KakaoLoginResponse,
} from "../services/authApi";

/**
 * 카카오 로그인 비즈니스 로직 훅.
 * login()은 카카오톡 앱이 설치되어 있으면 앱으로, 없으면 웹 계정 로그인으로 진행.
 */
export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signInWithKakao =
    useCallback(async (): Promise<KakaoLoginResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("[Kakao Login] Starting login()...");
        const result = await login();
        console.log("[Kakao Login] login() returned:", JSON.stringify(result));
        const { accessToken } = result;
        console.log("[Kakao Login] accessToken from SDK:", accessToken);
        const session = await loginWithKakaoToken(accessToken);
        // 서비스 JWT를 기기 암호화 저장소에 보관 (자동 로그인 + API 인증에 사용)
        await saveTokens(session.accessToken, session.refreshToken);
        return session;
      } catch (err) {
        console.log("[Kakao Login] Error caught:", String(err));
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  return { signInWithKakao, isLoading, error };
};
