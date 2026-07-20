import * as SecureStore from "expo-secure-store";

/**
 * 서류홈(ai-reviewer) 튜토리얼을 이미 봤는지 여부.
 * onboardingStorage.ts와 동일하게 expo-secure-store에 보관 - 한 번 보면 기기에서 다시 안 뜬다.
 */

const TUTORIAL_SEEN_KEY = "ai-reviewer.tutorial.seen";

export const hasSeenTutorial = async (): Promise<boolean> => {
  const value = await SecureStore.getItemAsync(TUTORIAL_SEEN_KEY);
  return value === "true";
};

export const markTutorialSeen = (): Promise<void> =>
  SecureStore.setItemAsync(TUTORIAL_SEEN_KEY, "true");
