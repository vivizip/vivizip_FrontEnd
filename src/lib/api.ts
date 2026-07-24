import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "./tokenStorage";

/**
 * 앱 전역에서 공용으로 쓰는 axios 인스턴스.
 *
 * baseURL은 환경변수 EXPO_PUBLIC_API_URL에서 읽는다.
 * - 값은 .env(로컬) 또는 eas.json의 프로파일별 env(빌드)에서 주입된다.
 * - EXPO_PUBLIC_ 접두사 변수는 빌드 시 번들에 평문으로 포함되므로 비밀값을 넣지 말 것.
 * - 반드시 정적 dot 표기(process.env.EXPO_PUBLIC_API_URL)로 접근해야 인라인된다.
 */
const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  // 개발 중 환경변수 누락을 조용히 넘기지 않도록 경고
  console.warn(
    "[api] EXPO_PUBLIC_API_URL이 설정되지 않았습니다. .env 파일을 확인하세요.",
  );
}

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 로그인 후 저장된 서비스 JWT를 모든 요청에 자동 첨부
api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ---- 토큰 만료(401) 시 자동 재발급 ----

type ReissueResponse = {
  grantType: string;
  accessToken: string;
  refreshToken: string;
  code_expire: string;
  refresh_expire: string;
};

// 동시에 여러 요청이 401을 맞아도 재발급은 한 번만 수행
let reissuePromise: Promise<string | null> | null = null;

const reissueTokens = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    // api 인스턴스를 쓰면 인터셉터가 다시 돌아 무한루프가 되므로 순수 axios로 호출
    const { data } = await axios.post<ReissueResponse>(
      `${baseURL}/api/tokens/reissue`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" }, timeout: 10000 },
    );
    await saveTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    // 재발급 실패 = 세션 만료. 토큰을 지워 게이트(/)가 로그인으로 보내게 한다
    await clearTokens();
    return null;
  }
};

/** 앱이 활성화되어 있을 때 호출하는 주기적 토큰 갱신 함수. 동시 호출은 하나로 합친다. */
export const refreshTokens = async (): Promise<string | null> => {
  const pending = reissuePromise ?? reissueTokens();
  reissuePromise = pending;
  try {
    return await pending;
  } finally {
    if (reissuePromise === pending) {
      reissuePromise = null;
    }
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      original &&
      !original._retry
    ) {
      original._retry = true; // 요청당 재시도는 1회만
      const newAccessToken = await refreshTokens();

      if (newAccessToken) {
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
