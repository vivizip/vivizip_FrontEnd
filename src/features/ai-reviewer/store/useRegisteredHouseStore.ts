import { create } from "zustand";

export type RegisteredHouse = {
  id: string;
  title: string;
  subtitle: string;
};

type RegisteredHouseState = {
  /** 등록된 집 목록 (최근 등록 순). */
  houses: RegisteredHouse[];
  currentHouseId: string | null;
  /**
   * 현재 설정된 집 주소 (houses에서 currentHouseId에 해당하는 title).
   * 없으면 null (HouseSelector가 "등록된 집이 없어요" 표시) - houses/currentHouseId와
   * 항상 같이 갱신되는 파생값이라, 이 필드만 구독하는 기존 화면들(HouseSelector,
   * DocumentChecklist, register-document.tsx)은 그대로 쓸 수 있다.
   */
  address: string | null;
  /** 주소 검색(confirm.tsx)에서 확정한 새 집을 목록 맨 앞에 추가하고 현재 집으로 설정한다. */
  addHouse: (house: { title: string; subtitle: string }) => void;
  setCurrentHouse: (id: string) => void;
  removeHouse: (id: string) => void;
};

/**
 * (tabs)/ai-reviewer.tsx의 HouseSelector와 ai-reviewer/confirm.tsx, houses.tsx의
 * 저장/삭제 액션이 서로 다른 네비게이션 컨텍스트(탭/스택)에 있어서 상태를 공유하기 위한 스토어.
 */
export const useRegisteredHouseStore = create<RegisteredHouseState>((set) => ({
  houses: [],
  currentHouseId: null,
  address: null,
  addHouse: (house) =>
    set((state) => {
      const newHouse: RegisteredHouse = { id: `${Date.now()}`, ...house };
      return {
        houses: [newHouse, ...state.houses],
        currentHouseId: newHouse.id,
        address: newHouse.title,
      };
    }),
  setCurrentHouse: (id) =>
    set((state) => {
      const house = state.houses.find((h) => h.id === id);
      if (!house) return state;
      return { currentHouseId: id, address: house.title };
    }),
  removeHouse: (id) =>
    set((state) => {
      const next = state.houses.filter((h) => h.id !== id);
      if (state.currentHouseId !== id) {
        return { houses: next };
      }
      // 삭제한 집이 현재 집이었다면 남은 것 중 맨 앞을 새 현재 집으로 승격
      const promoted = next[0] ?? null;
      return {
        houses: next,
        currentHouseId: promoted?.id ?? null,
        address: promoted?.title ?? null,
      };
    }),
}));
