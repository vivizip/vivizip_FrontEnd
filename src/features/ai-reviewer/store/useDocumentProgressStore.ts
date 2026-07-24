import { create } from "zustand";

type DocumentProgressState = {
  /**
   * 집(leaseCaseId, useRegisteredHouseStore의 currentHouseId)별로 발급/분석이
   * 완료된 체크리스트 항목 id 목록 (constants.ts의 ChecklistItem.id).
   * 집마다 서로 다른 서류 진행 상태를 가지므로 house별로 분리해서 저장한다.
   */
  completedItemIdsByHouse: Record<string, string[]>;
  markCompleted: (houseId: string, itemId: string) => void;
};

/**
 * (tabs)/ai-reviewer.tsx의 DocumentChecklist와 ai-reviewer/document-result.tsx가
 * 서로 다른 네비게이션 컨텍스트(탭/스택)에 있어서 완료 상태를 공유하기 위한 스토어.
 * document-result 화면에 도달하면(=발급/분석 완료) 해당 항목을 완료 처리한다.
 */
export const useDocumentProgressStore = create<DocumentProgressState>((set) => ({
  completedItemIdsByHouse: {},
  markCompleted: (houseId, itemId) =>
    set((state) => {
      const current = state.completedItemIdsByHouse[houseId] ?? [];
      if (current.includes(itemId)) return state;
      return {
        completedItemIdsByHouse: {
          ...state.completedItemIdsByHouse,
          [houseId]: [...current, itemId],
        },
      };
    }),
}));
