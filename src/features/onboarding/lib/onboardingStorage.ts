import * as SecureStore from "expo-secure-store";

/**
 * 로그인 직후 온보딩 튜토리얼(5단계)을 이미 봤는지 여부.
 * tokenStorage.ts와 동일하게 expo-secure-store에 보관 - 한 번 보면 기기에서 다시 안 뜬다.
 */

const ONBOARDING_SEEN_KEY = "onboarding.seen";

export const hasSeenOnboarding = async (): Promise<boolean> => {
  // TODO(테스트용 임시 비활성화): 온보딩이 매번 뜨는지 확인하기 위해 기기에 저장된
  // 값과 무관하게 항상 false를 반환하게 해둠 - 테스트 끝나면 아래 두 줄 원복할 것.
  // const value = await SecureStore.getItemAsync(ONBOARDING_SEEN_KEY);
  // return value === "true";
  return false;
};

export const markOnboardingSeen = (): Promise<void> =>
  SecureStore.setItemAsync(ONBOARDING_SEEN_KEY, "true");
