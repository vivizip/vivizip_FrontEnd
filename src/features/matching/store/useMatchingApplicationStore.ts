import { create } from "zustand";

type MatchingApplicationState = {
  /** 부메랑 신청 온보딩 완료 여부. true가 되면 홈 배너가 매칭완료 상태로 바뀐다. */
  isApplied: boolean;
  markApplied: () => void;
};

/**
 * MatchingOnboardingScreen(온보딩 완료 화면의 "완료")과 home.tsx의 BoomerangBannerCard가
 * 서로 다른 네비게이션 컨텍스트(스택/탭)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useMatchingApplicationStore = create<MatchingApplicationState>(
  (set) => ({
    isApplied: false,
    markApplied: () => set({ isApplied: true }),
  }),
);
