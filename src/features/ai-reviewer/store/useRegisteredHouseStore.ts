import { create } from "zustand";

type RegisteredHouseState = {
  /** 등록된 집 주소. 없으면 null (HouseSelector가 "등록된 집이 없어요" 표시) */
  address: string | null;
  setAddress: (address: string) => void;
  /** 현재 설정된 집을 삭제했을 때 등 등록 상태를 초기화 */
  clearAddress: () => void;
};

/**
 * (tabs)/ai-reviewer.tsx의 HouseSelector와 ai-reviewer/confirm.tsx, houses.tsx의
 * 저장/삭제 액션이 서로 다른 네비게이션 컨텍스트(탭/스택)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useRegisteredHouseStore = create<RegisteredHouseState>((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
  clearAddress: () => set({ address: null }),
}));
