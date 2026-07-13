import { create } from "zustand";

type DocumentProgressState = {
  /** 발급/분석이 완료된 체크리스트 항목 id 목록 (constants.ts의 ChecklistItem.id) */
  completedItemIds: string[];
  markCompleted: (itemId: string) => void;
};

/**
 * (tabs)/ai-reviewer.tsx의 DocumentChecklist와 ai-reviewer/document-result.tsx가
 * 서로 다른 네비게이션 컨텍스트(탭/스택)에 있어서 완료 상태를 공유하기 위한 스토어.
 * document-result 화면에 도달하면(=발급/분석 완료) 해당 항목을 완료 처리한다.
 */
export const useDocumentProgressStore = create<DocumentProgressState>((set) => ({
  completedItemIds: [],
  markCompleted: (itemId) =>
    set((state) =>
      state.completedItemIds.includes(itemId)
        ? state
        : { completedItemIds: [...state.completedItemIds, itemId] },
    ),
}));
