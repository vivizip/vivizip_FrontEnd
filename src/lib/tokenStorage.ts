import * as SecureStore from "expo-secure-store";

/**
 * 서비스 JWT 보관소.
 * expo-secure-store(기기 암호화 저장소)에 저장하고,
 * 매 요청마다 디스크를 읽지 않도록 메모리에 캐시한다.
 */

const ACCESS_TOKEN_KEY = "auth.accessToken";
const REFRESH_TOKEN_KEY = "auth.refreshToken";

let cachedAccessToken: string | null | undefined; // undefined = 아직 안 읽음

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  cachedAccessToken = accessToken;
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
  ]);
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken !== undefined) {
    return cachedAccessToken;
  }
  cachedAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  return cachedAccessToken;
};

export const getRefreshToken = (): Promise<string | null> =>
  SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const clearTokens = async (): Promise<void> => {
  cachedAccessToken = null;
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
};
