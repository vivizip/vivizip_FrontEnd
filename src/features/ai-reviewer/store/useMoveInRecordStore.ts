import { create } from "zustand";

import type { MoveInRecordListItem } from "../services/moveInRecordApi";

type MoveInRecordState = {
  /** GET /api/move-in-records 최신 조회 결과. 마이페이지의 기록 수 표시와도 공유한다. */
  records: MoveInRecordListItem[];
  setRecords: (records: MoveInRecordListItem[]) => void;
};

/**
 * ai-reviewer/after/move-in-record.tsx(목록)와 mypage의 MyInfoSection(기록 수 표시)이
 * 서로 다른 네비게이션 컨텍스트에 있어서 최신 목록을 공유하기 위한 스토어.
 */
export const useMoveInRecordStore = create<MoveInRecordState>((set) => ({
  records: [],
  setRecords: (records) => set({ records }),
}));
