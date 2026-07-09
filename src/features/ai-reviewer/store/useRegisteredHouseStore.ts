import { create } from "zustand";

type RegisteredHouseState = {
  /** 등록된 집 주소. 없으면 null (HouseSelector가 "등록된 집이 없어요" 표시) */
  address: string | null;
  setAddress: (address: string) => void;
};

/**
 * (tabs)/ai-reviewer.tsx의 HouseSelector와 ai-reviewer/confirm.tsx의 저장 액션이
 * 서로 다른 네비게이션 컨텍스트(탭/스택)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useRegisteredHouseStore = create<RegisteredHouseState>((set) => ({
  address: null,
  setAddress: (address) => set({ address }),
}));
