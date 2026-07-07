import { useCallback, useState } from "react";
import { login } from "@react-native-seoul/kakao-login";
import {
  loginWithKakaoToken,
  type KakaoLoginResponse,
} from "../services/authApi";

/**
 * 카카오 로그인 비즈니스 로직 훅.
 * login()은 카카오톡 앱이 설치되어 있으면 앱으로, 없으면 웹 계정 로그인으로 진행된다.
 * 카카오 accessToken을 백엔드로 보내 우리 서비스 JWT로 교환한 결과를 반환한다.
 */
export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signInWithKakao =
    useCallback(async (): Promise<KakaoLoginResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const { accessToken } = await login();
        // 카카오 accessToken을 백엔드로 전달해 서비스 토큰으로 교환
        return await loginWithKakaoToken(accessToken);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  return { signInWithKakao, isLoading, error };
};
