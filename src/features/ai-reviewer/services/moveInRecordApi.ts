import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const MOVE_IN_RECORDS_ENDPOINT = "/api/move-in-records";

export type MoveInDefectType =
  | "WALLPAPER"
  | "MOLD"
  | "TILE_CRACK"
  | "SUNLIGHT"
  | "BOILER"
  | "NOISE"
  | "SMELL"
  | "FURNITURE"
  | "LEAK";

// IssueChipSelector.tsx의 ISSUE_OPTIONS 순서와 1:1 대응 (백엔드 enum <-> 한글 라벨)
export const DEFECT_TYPE_LABELS: Record<MoveInDefectType, string> = {
  WALLPAPER: "벽지",
  MOLD: "곰팡이",
  TILE_CRACK: "타일깨짐",
  SUNLIGHT: "햇빛",
  BOILER: "보일러",
  NOISE: "소음",
  SMELL: "냄새",
  FURNITURE: "가구",
  LEAK: "누수",
};

export const DEFECT_TYPE_BY_LABEL: Record<string, MoveInDefectType> =
  Object.fromEntries(
    (Object.entries(DEFECT_TYPE_LABELS) as [MoveInDefectType, string][]).map(
      ([type, label]) => [label, type],
    ),
  );

export type MoveInDefect = { type: MoveInDefectType; label: string };
export type MoveInPhoto = { id: number; fileUrl: string; sortOrder: number };

export type MoveInRecordDetail = {
  id: number;
  leaseCaseId: number;
  memo: string;
  defects: MoveInDefect[];
  photos: MoveInPhoto[];
  createdAt: string;
  updatedAt: string;
};

export type MoveInRecordListItem = {
  id: number;
  leaseCaseId: number;
  thumbnailUrl: string | null;
  defects: MoveInDefectType[];
  createdAt: string;
};

export type MoveInRecordSort = "latest" | "oldest";

// 5개 CRUD 함수가 전부 같은 axios 에러 -> ApiEnvelope.message 추출 패턴을 반복해서 공용화
const withErrorMessage = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (err) {
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<never> | undefined;
      if (envelope?.message) {
        throw new Error(envelope.message);
      }
    }
    throw err;
  }
};

export type CreateMoveInRecordParams = {
  leaseCaseId: number;
  memo?: string;
  defects?: MoveInDefectType[];
  files?: string[];
};

/** 입주 기록 생성. leaseCaseId만 필수, memo/defects/files는 모두 선택. */
export const createMoveInRecord = (
  params: CreateMoveInRecordParams,
): Promise<MoveInRecordDetail> =>
  withErrorMessage(async () => {
    const formData = new FormData();
    (params.files ?? []).forEach((uri, index) => {
      formData.append("files", {
        uri,
        name: `move_in_${index}.jpg`,
        type: "image/jpeg",
      } as unknown as Blob);
    });

    const { data } = await api.post<MoveInRecordDetail>(
      MOVE_IN_RECORDS_ENDPOINT,
      formData,
      {
        params: {
          leaseCaseId: params.leaseCaseId,
          memo: params.memo,
          defects: params.defects,
        },
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      },
    );
    return data;
  });

export type UpdateMoveInRecordParams = {
  memo?: string;
  defects?: MoveInDefectType[];
  deletePhotoIds?: number[];
  addFiles?: string[];
};

/** 입주 기록 수정. 전달하지 않은(undefined) 필드는 서버에서 변경되지 않는다. */
export const updateMoveInRecord = (
  id: number,
  params: UpdateMoveInRecordParams,
): Promise<MoveInRecordDetail> =>
  withErrorMessage(async () => {
    const formData = new FormData();
    (params.addFiles ?? []).forEach((uri, index) => {
      formData.append("addFiles", {
        uri,
        name: `move_in_${index}.jpg`,
        type: "image/jpeg",
      } as unknown as Blob);
    });

    const { data } = await api.patch<MoveInRecordDetail>(
      `${MOVE_IN_RECORDS_ENDPOINT}/${id}`,
      formData,
      {
        params: {
          memo: params.memo,
          defects: params.defects,
          deletePhotoIds: params.deletePhotoIds,
        },
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      },
    );
    return data;
  });

export const getMoveInRecord = (id: number): Promise<MoveInRecordDetail> =>
  withErrorMessage(async () => {
    const { data } = await api.get<MoveInRecordDetail>(
      `${MOVE_IN_RECORDS_ENDPOINT}/${id}`,
    );
    return data;
  });

export const listMoveInRecords = (
  sort: MoveInRecordSort = "latest",
): Promise<MoveInRecordListItem[]> =>
  withErrorMessage(async () => {
    const { data } = await api.get<MoveInRecordListItem[]>(
      MOVE_IN_RECORDS_ENDPOINT,
      { params: { sort } },
    );
    return data;
  });

export const deleteMoveInRecord = (id: number): Promise<void> =>
  withErrorMessage(async () => {
    await api.delete(`${MOVE_IN_RECORDS_ENDPOINT}/${id}`);
  });
