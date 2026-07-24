import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const REGISTRY_UPLOAD_ANALYZE_ENDPOINT =
  "/api/documents/registry/upload-analyze";
const REGISTRY_ANALYSIS_ENDPOINT = "/api/documents/registry/analysis";

const FALLBACK_ANALYSIS_ERROR = "등기부등본 분석 결과를 불러오지 못했어요.";

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

type RegistryAnalysisStatusResponse = {
  analysisId: number;
  status: string;
  result: RegistryAnalysis | null;
  failureReason: string | null;
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
        // OCR+AI 분석이 걸리는 시간을 감안해 공용 인스턴스의 기본 10초보다 넉넉하게 설정
        timeout: 60000,
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

/**
 * leaseCaseId로 등록된 등기부등본 중 가장 최근 건의 분석 결과를 다시 조회한다.
 * 재촬영 없이 "분석완료" 상태의 항목을 다시 열었을 때 결과를 바로 보여주기 위한 용도.
 * 이 응답의 result는 upload-analyze의 analysis 필드와만 같고 riskExplanations/
 * marketPrice/depositRiskRatio는 안 줘서, 위험 설명은 빈 배열로 시세/위험비율은
 * null로 채워 넣는다(근저당 탭에서 "확인되지 않음"으로 표시됨).
 */
export const getRegistryAnalysis = async (
  leaseCaseId: number,
): Promise<RegistryAnalysisResult> => {
  try {
    const { data } = await api.get<RegistryAnalysisStatusResponse>(
      REGISTRY_ANALYSIS_ENDPOINT,
      { params: { leaseCaseId } },
    );
    if (!data.result) {
      throw new Error(data.failureReason ?? FALLBACK_ANALYSIS_ERROR);
    }
    return {
      analysis: data.result,
      riskExplanations: [],
      marketPrice: null,
      depositRiskRatio: null,
    };
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
