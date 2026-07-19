import { create } from "zustand";

import type { MatchingRole } from "../types";

type MatchingApplicationState = {
  /** 부메랑 신청 온보딩 완료 여부. true가 되면 홈 배너가 매칭완료 상태로 바뀐다. */
  isApplied: boolean;
  /** 온보딩 1단계에서 고른 역할. 마이페이지의 "서포터즈" 뱃지 표시 여부에 쓰인다. */
  role: MatchingRole | null;
  /**
   * 지금까지 성사된 매칭(=대화방) 누적 횟수. 마이페이지 "매칭 N회" 통계에 쓰인다.
   * 대화방을 삭제해도 감소하지 않는 누적값이라 markApplied에서만 증가시킨다.
   */
  matchCount: number;
  /** 대화방에서 "집 구하기 완료"를 처음 누른 시각. 마이페이지 "D+N" 통계에 쓰인다. */
  houseFoundAt: Date | null;
  markApplied: (role: MatchingRole | null) => void;
  markHouseFound: () => void;
};

/**
 * MatchingOnboardingScreen(온보딩 완료 화면의 "완료")과 home.tsx의 BoomerangBannerCard,
 * MateChatScreen("집 구하기 완료" 버튼), mypage.tsx의 MyInfoSection이 서로 다른
 * 네비게이션 컨텍스트(스택/탭)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useMatchingApplicationStore = create<MatchingApplicationState>(
  (set) => ({
    isApplied: false,
    role: null,
    matchCount: 0,
    houseFoundAt: null,
    markApplied: (role) =>
      set((state) => ({
        isApplied: true,
        role,
        matchCount: state.matchCount + 1,
      })),
    // 이미 눌렀다면 다시 눌러도 최초 시각을 유지한다(카운터가 앞으로 가지 않도록).
    markHouseFound: () =>
      set((state) =>
        state.houseFoundAt ? state : { houseFoundAt: new Date() },
      ),
  }),
);
