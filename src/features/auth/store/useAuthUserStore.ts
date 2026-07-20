import { create } from "zustand";

import type { MyProfileResponse } from "../services/authApi";

type AuthUserState = {
  user: MyProfileResponse | null;
  setUser: (user: MyProfileResponse) => void;
  /** user가 있을 때만 일부 필드를 병합한다 (예: 학교 인증 완료 후 schoolVerified). */
  updateUser: (partial: Partial<MyProfileResponse>) => void;
  clearUser: () => void;
};

/**
 * GET /api/users/me(getMyProfile) 응답을 앱 전역에서 조회하기 위한 스토어.
 * useKakaoLogin이 로그인 성공 시, index.tsx 진입 게이트가 자동 로그인 시 각각
 * getMyProfile을 호출해 setUser로 채운다. 로그아웃 시 clearUser로 비운다.
 */
export const useAuthUserStore = create<AuthUserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (partial) =>
    set((state) => (state.user ? { user: { ...state.user, ...partial } } : state)),
  clearUser: () => set({ user: null }),
}));
