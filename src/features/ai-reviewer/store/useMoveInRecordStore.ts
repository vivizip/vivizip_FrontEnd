import { create } from "zustand";

export type MoveInRecord = {
  id: string;
  address: string;
  issues: string[];
  content: string;
  photoUris: string[];
};

type MoveInRecordState = {
  /** 작성된 입주 기록 목록 - 최신순으로 앞에 추가 */
  records: MoveInRecord[];
  addRecord: (record: Omit<MoveInRecord, "id">) => void;
  updateRecord: (id: string, updates: Partial<Omit<MoveInRecord, "id">>) => void;
  deleteRecord: (id: string) => void;
};

/**
 * ai-reviewer/after/move-in-record.tsx(목록)와 write-move-in-record.tsx(작성),
 * move-in-record-detail.tsx(상세/수정)가 서로 다른 네비게이션 컨텍스트에 있어서
 * 기록을 공유하기 위한 스토어.
 */
export const useMoveInRecordStore = create<MoveInRecordState>((set) => ({
  records: [],
  addRecord: (record) =>
    set((state) => ({
      records: [{ ...record, id: `${Date.now()}` }, ...state.records],
    })),
  updateRecord: (id, updates) =>
    set((state) => ({
      records: state.records.map((record) =>
        record.id === id ? { ...record, ...updates } : record,
      ),
    })),
  deleteRecord: (id) =>
    set((state) => ({
      records: state.records.filter((record) => record.id !== id),
    })),
}));
