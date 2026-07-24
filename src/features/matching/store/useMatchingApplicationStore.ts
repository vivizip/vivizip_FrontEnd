import { create } from "zustand";

import type { MatchResult, MatchStatusValue } from "../services/matchApi";
import type { MatchingRole } from "../types";

type MatchingApplicationState = {
  /**
   * GET /api/matches/status의 3단계 진행 상태. 앱을 새로 켜면 이 스토어는 기본값
   * "NOT_APPLIED"로 초기화되므로, 홈 화면이 포커스될 때마다 실제 값으로 갱신해야 한다
   * (BoomerangBannerCard 참고).
   */
  matchStatus: MatchStatusValue;
  /** 온보딩 1단계에서 고른 역할. 마이페이지의 "서포터즈" 뱃지 표시 여부에 쓰인다. */
  role: MatchingRole | null;
  /**
   * 지금까지 성사된 매칭(=대화방) 누적 횟수. 마이페이지 "매칭 N회" 통계에 쓰인다.
   * 대화방을 삭제해도 감소하지 않는 누적값이라 markApplied에서만 증가시킨다.
   */
  matchCount: number;
  /** 대화방에서 "집 구하기 완료"를 처음 누른 시각. 마이페이지 "D+N" 통계에 쓰인다. */
  houseFoundAt: Date | null;
  /** POST /api/matches(유학생 매칭 신청) 응답. 서포터즈는 이 호출을 하지 않아 null로 남는다. */
  lastMatch: MatchResult | null;
  markApplied: (role: MatchingRole | null) => void;
  markHouseFound: () => void;
  /** 채팅방에서 "집 구하기 완료"를 다시 눌러 취소했을 때 - 원래 표시 안 한 상태로 되돌린다. */
  unmarkHouseFound: () => void;
  setLastMatch: (match: MatchResult) => void;
  setMatchStatus: (status: MatchStatusValue) => void;
};

/**
 * MatchingOnboardingScreen(온보딩 완료 화면의 "완료")과 home.tsx의 BoomerangBannerCard,
 * MateChatScreen("집 구하기 완료" 버튼), mypage.tsx의 MyInfoSection이 서로 다른
 * 네비게이션 컨텍스트(스택/탭)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useMatchingApplicationStore = create<MatchingApplicationState>(
  (set) => ({
    matchStatus: "NOT_APPLIED",
    role: null,
    matchCount: 0,
    houseFoundAt: null,
    lastMatch: null,
    markApplied: (role) =>
      set((state) => ({
        role,
        matchCount: state.matchCount + 1,
      })),
    // 이미 눌렀다면 다시 눌러도 최초 시각을 유지한다(카운터가 앞으로 가지 않도록).
    markHouseFound: () =>
      set((state) =>
        state.houseFoundAt ? state : { houseFoundAt: new Date() },
      ),
    unmarkHouseFound: () => set({ houseFoundAt: null }),
    setLastMatch: (match) => set({ lastMatch: match }),
    setMatchStatus: (status) => set({ matchStatus: status }),
  }),
);
