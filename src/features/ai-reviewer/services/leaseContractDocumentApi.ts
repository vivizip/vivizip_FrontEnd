import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const LEASE_CONTRACT_UPLOAD_ANALYZE_ENDPOINT =
  "/api/documents/lease-contract/upload-analyze";
const LEASE_CONTRACT_ANALYSIS_ENDPOINT = "/api/documents/lease-contract/analysis";

const FALLBACK_ANALYSIS_ERROR = "임대차계약서 분석 결과를 불러오지 못했어요.";

export type LeaseContractRegionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LeaseContractRegion = {
  documentPage: number;
  box: LeaseContractRegionBox;
  label: string;
};

export type LeaseContractBasicInfo = {
  matchesBrokerageDocument: boolean | null;
  owner: string;
  /** "YYYY.MM.DD" */
  contractDate: string;
  roadAddress: string;
  /** "YYYY.MM.DD" */
  leaseStartDate: string;
  /** "YYYY.MM.DD" */
  leaseEndDate: string;
  regions: LeaseContractRegion[];
};

export type LeaseContractCost = {
  deposit: number;
  monthlyRent: number | null;
  depositMatched: boolean | null;
  monthlyRentMatched: boolean | null;
  depositMessage: string | null;
  monthlyRentMessage: string | null;
  regions: LeaseContractRegion[];
};

export type LeaseContractRiskyClause = {
  originalText: string;
  reason: string;
  suggestion: string;
  regions: LeaseContractRegion[];
};

export type LeaseContractAnalysisResult = {
  basicInfo: LeaseContractBasicInfo;
  cost: LeaseContractCost;
  riskyClauses: LeaseContractRiskyClause[];
};

/**
 * 임대차계약서 이미지를 업로드해 OCR + AI 분석을 요청한다.
 * 중개대상물 확인·설명서(reference_baseline)가 등록돼 있으면 소유자·주소·보증금·월세
 * 일치 여부를 함께 비교한다. 분석 결과는 DB에 저장되지 않는 1회성 응답.
 */
export const uploadAndAnalyzeLeaseContract = async (
  leaseCaseId: number,
  imageUri: string,
): Promise<LeaseContractAnalysisResult> => {
  const formData = new FormData();
  formData.append("files", {
    uri: imageUri,
    name: "lease_contract.jpg",
    type: "image/jpeg",
    // RN의 FormData 파일 객체는 DOM Blob 타입과 달라 캐스팅이 필요하다
  } as unknown as Blob);

  console.log(
    "[leaseContractDocumentApi] POST",
    LEASE_CONTRACT_UPLOAD_ANALYZE_ENDPOINT,
    "leaseCaseId:",
    leaseCaseId,
    "files:",
    { field: "files", name: "lease_contract.jpg", uri: imageUri },
  );

  try {
    // api 인스턴스 기본 헤더가 Content-Type: application/json이라, 이걸 명시적으로
    // multipart/form-data로 덮어써야 RN이 FormData를 보고 boundary를 붙여준다.
    const { data } = await api.post<LeaseContractAnalysisResult>(
      LEASE_CONTRACT_UPLOAD_ANALYZE_ENDPOINT,
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

type LeaseContractAnalysisStatusResponse = {
  analysisId: number;
  status: string;
  result: LeaseContractAnalysisResult | null;
  failureReason: string | null;
};

/**
 * leaseCaseId로 등록된 임대차계약서 중 가장 최근 건의 분석 결과를 다시 조회한다.
 * 재촬영 없이 "분석완료" 상태의 항목을 다시 열었을 때 결과를 바로 보여주기 위한 용도.
 * 응답 형식은 업로드+분석 API와 동일하다.
 */
export const getLeaseContractAnalysis = async (
  leaseCaseId: number,
): Promise<LeaseContractAnalysisResult> => {
  try {
    const { data } = await api.get<LeaseContractAnalysisStatusResponse>(
      LEASE_CONTRACT_ANALYSIS_ENDPOINT,
      { params: { leaseCaseId } },
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
