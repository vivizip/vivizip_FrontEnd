import { create } from "zustand";

type TutorialSeenState = {
  /** 이번 앱 세션에서 서류홈 튜토리얼 화면을 이미 봤는지 (영속화 안 함 - 앱 재시작 시 초기화) */
  seen: boolean;
  markSeen: () => void;
};

/**
 * (tabs)/ai-reviewer.tsx(리다이렉트 판단)와 ai-reviewer/tutorial.tsx(마운트 시 markSeen)가
 * 서로 다른 네비게이션 컨텍스트에 있어서 상태를 공유하기 위한 스토어.
 * 집 미등록 + 아직 안 본 세션에서만 튜토리얼이 뜬다.
 */
export const useTutorialSeenStore = create<TutorialSeenState>((set) => ({
  seen: false,
  markSeen: () => set({ seen: true }),
}));
