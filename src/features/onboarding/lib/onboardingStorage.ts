import * as SecureStore from "expo-secure-store";

/**
 * 로그인 직후 온보딩 튜토리얼(5단계)을 이미 봤는지 여부.
 * 계정별로 다시 뜨게 하기 위해 userId를 키에 포함한다(한 기기에서 계정을 바꿔 로그인해도
 * 각 계정마다 최초 1회는 뜬다). 로그인 없이 "비회원으로 둘러보기"로 들어온 경우는
 * userId가 없어 "guest" 키를 공유한다.
 * tokenStorage.ts와 동일하게 expo-secure-store에 보관.
 */

const ONBOARDING_SEEN_KEY_PREFIX = "onboarding.seen.";

const buildKey = (userId: number | null) =>
  `${ONBOARDING_SEEN_KEY_PREFIX}${userId ?? "guest"}`;

export const hasSeenOnboarding = async (
  userId: number | null,
): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(buildKey(userId));
  return value === "true";
};

export const markOnboardingSeen = (userId: number | null): Promise<void> =>
  SecureStore.setItemAsync(buildKey(userId), "true");
