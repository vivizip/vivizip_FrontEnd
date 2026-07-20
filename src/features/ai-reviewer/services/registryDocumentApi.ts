import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const REGISTRY_UPLOAD_ANALYZE_ENDPOINT =
  "/api/documents/registry/upload-analyze";

export type RegistryRiskFlags = {
  provisionalRegistration: boolean;
  trust: boolean;
  seizure: boolean;
  provisionalSeizure: boolean;
  auctionStart: boolean;
  leaseRegistration: boolean;
  jeonseRight: boolean;
};

export type RegistryAnalysis = {
  propertyAddress: string;
  ownerName: string;
  /** "YYYY.MM.DD" */
  registeredAt: string;
  /** "YYYY.MM.DD" */
  issuedAt: string;
  hasMortgage: boolean;
  mortgageMaximumClaimAmount: number | null;
  buildingUsage: string | null;
  isResidential: boolean;
  riskFlags: RegistryRiskFlags;
  hasSummaryPage: boolean;
};

export type RegistryRiskExplanation = {
  riskType: string;
  term: string;
  explanation: string;
};

export type RegistryAnalysisResult = {
  analysis: RegistryAnalysis;
  riskExplanations: RegistryRiskExplanation[];
  marketPrice: number | null;
  depositRiskRatio: number | null;
};

/**
 * 등기부등본 이미지를 업로드해 OCR + AI 분석을 한 번에 요청한다.
 * leaseCaseId 기준으로 기존 서류가 있으면 재사용, 없으면 자동 생성됨(백엔드 처리).
 */
export const uploadAndAnalyzeRegistry = async (
  leaseCaseId: number,
  imageUris: string[],
): Promise<RegistryAnalysisResult> => {
  const formData = new FormData();
  imageUris.forEach((uri, index) => {
    formData.append("files", {
      uri,
      name: `registry_${index}.jpg`,
      type: "image/jpeg",
      // RN의 FormData 파일 객체는 DOM Blob 타입과 달라 캐스팅이 필요하다
    } as unknown as Blob);
  });

  console.log(
    "[registryDocumentApi] POST",
    REGISTRY_UPLOAD_ANALYZE_ENDPOINT,
    "leaseCaseId:",
    leaseCaseId,
    "files:",
    imageUris.map((uri, index) => ({
      field: "files",
      name: `registry_${index}.jpg`,
      uri,
    })),
  );

  try {
    // api 인스턴스 기본 헤더가 Content-Type: application/json이라, 이걸 명시적으로
    // multipart/form-data로 덮어써야 RN이 FormData를 보고 boundary를 붙여준다.
    // (기본값 그대로 두면 JSON으로 보내져서 서버가 파일을 못 읽는다)
    const { data } = await api.post<RegistryAnalysisResult>(
      REGISTRY_UPLOAD_ANALYZE_ENDPOINT,
      formData,
      {
        params: { leaseCaseId },
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
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
