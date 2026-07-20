import { create } from "zustand";

import { hasSeenTutorial, markTutorialSeen } from "../lib/tutorialStorage";

type TutorialSeenState = {
  /** 서류홈 튜토리얼 화면을 이미 봤는지 (expo-secure-store에 영속화 - 기기에서 한 번만 뜬다) */
  seen: boolean;
  /** secure-store에서 초기값을 불러왔는지 - 로드 전에는 리다이렉트 판단을 보류해야 함 */
  hydrated: boolean;
  markSeen: () => void;
};

/**
 * (tabs)/ai-reviewer.tsx(리다이렉트 판단)와 ai-reviewer/tutorial.tsx(마운트 시 markSeen)가
 * 서로 다른 네비게이션 컨텍스트에 있어서 상태를 공유하기 위한 스토어.
 * 집 미등록 + 기기에서 아직 안 봤을 때만 튜토리얼이 뜬다(한 번 보면 다시 안 뜸).
 */
export const useTutorialSeenStore = create<TutorialSeenState>((set) => {
  hasSeenTutorial().then((seen) => set({ seen, hydrated: true }));

  return {
    seen: false,
    hydrated: false,
    markSeen: () => {
      markTutorialSeen();
      set({ seen: true });
    },
  };
});
