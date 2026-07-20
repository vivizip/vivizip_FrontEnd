import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const BUILDING_LEDGER_UPLOAD_ANALYZE_ENDPOINT =
  "/api/documents/building-ledger/upload-analyze";

const FALLBACK_ANALYSIS_ERROR =
  "건축물대장 분석에 실패했어요. 다시 시도해주세요.";

export type BuildingLedgerAnalysis = {
  /** "YYYY.MM.DD" */
  issuedDate: string;
  hasViolation: boolean;
  ownerName: string;
  /** "YYYY.MM.DD" */
  ownershipTransferDate: string;
  /** 대지위치 + 지번 (지번 주소, 도로명주소 아님) */
  address: string;
  buildingUse: string;
  residential: boolean | null;
  ownerMatched: boolean | null;
  addressMatched: boolean | null;
};

type BuildingLedgerUploadResponse = {
  analysisId: number;
  status: string;
  result: BuildingLedgerAnalysis | null;
  failureReason: string | null;
};

/**
 * 건축물대장 표제부 이미지 1장을 업로드해 OCR + AI 분석을 요청한다.
 * (뒷장에 과거 이력이 섞여 있어 판단을 흐릴 수 있어 1장만 받음)
 */
export const uploadAndAnalyzeBuildingLedger = async (
  leaseCaseId: number,
  imageUri: string,
): Promise<BuildingLedgerAnalysis> => {
  const formData = new FormData();
  // 등기부등본(uploadAndAnalyzeRegistry)은 여러 장을 받아 "files"지만, 건축물대장은
  // 표제부 1장만 받는 별도 엔드포인트라 필드명이 단수 "file"이다 - 헷갈리기 쉬워 명시.
  formData.append("file", {
    uri: imageUri,
    name: "building_ledger.jpg",
    type: "image/jpeg",
    // RN의 FormData 파일 객체는 DOM Blob 타입과 달라 캐스팅이 필요하다
  } as unknown as Blob);

  console.log(
    "[buildingLedgerApi] POST",
    BUILDING_LEDGER_UPLOAD_ANALYZE_ENDPOINT,
    "leaseCaseId:",
    leaseCaseId,
    "file:",
    { field: "file", name: "building_ledger.jpg", uri: imageUri },
  );

  try {
    // api 인스턴스 기본 헤더가 Content-Type: application/json이라, 이걸 명시적으로
    // multipart/form-data로 덮어써야 RN이 FormData를 보고 boundary를 붙여준다.
    // (기본값 그대로 두면 JSON으로 보내져서 서버가 파일을 못 읽는다)
    const { data } = await api.post<BuildingLedgerUploadResponse>(
      BUILDING_LEDGER_UPLOAD_ANALYZE_ENDPOINT,
      formData,
      {
        params: { leaseCaseId },
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    if (!data.result) {
      throw new Error(data.failureReason ?? FALLBACK_ANALYSIS_ERROR);
    }
    return data.result;
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
