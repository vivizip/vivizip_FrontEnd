import * as SecureStore from "expo-secure-store";

/**
 * 로그인 직후 온보딩 튜토리얼(5단계)을 이미 봤는지 여부.
 * tokenStorage.ts와 동일하게 expo-secure-store에 보관 - 한 번 보면 기기에서 다시 안 뜬다.
 */

const ONBOARDING_SEEN_KEY = "onboarding.seen";

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(ONBOARDING_SEEN_KEY);
  return value === "true";
};

export const markOnboardingSeen = (): Promise<void> =>
  SecureStore.setItemAsync(ONBOARDING_SEEN_KEY, "true");
