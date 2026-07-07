import { useCallback, useState } from "react";
import {
  login,
  type KakaoOAuthToken,
} from "@react-native-seoul/kakao-login";

/**
 * 카카오 로그인 비즈니스 로직 훅.
 * login()은 카카오톡 앱이 설치되어 있으면 앱으로, 없으면 웹 계정 로그인으로 진행된다.
 */
export const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signInWithKakao =
    useCallback(async (): Promise<KakaoOAuthToken | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await login();
        // TODO: token.accessToken을 백엔드 로그인 API로 전달해 서비스 토큰으로 교환
        return token;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  return { signInWithKakao, isLoading, error };
};
