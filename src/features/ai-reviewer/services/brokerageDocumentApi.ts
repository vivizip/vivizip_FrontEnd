import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const BROKERAGE_UPLOAD_ANALYZE_ENDPOINT =
  "/api/documents/brokerage-document/upload-analyze";

export type BrokerageRegionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BrokerageRegion = {
  documentPage: number;
  box: BrokerageRegionBox;
  label: string;
};

export type BrokerageBasicInfo = {
  matchesRegistry: boolean | null;
  owner: string;
  roadAddress: string;
  regions: BrokerageRegion[];
};

export type BrokerageMortgage = {
  matchesRegistry: boolean | null;
  regions: BrokerageRegion[];
};

export type BrokerageLiability = {
  regions: BrokerageRegion[];
};

export type BrokerageAnalysisResult = {
  basicInfo: BrokerageBasicInfo;
  mortgage: BrokerageMortgage;
  liability: BrokerageLiability;
  brokerageFee: number | null;
};

/**
 * 중개대상물 확인·설명서 이미지를 업로드해 OCR + AI 분석을 요청한다.
 * 등기부등본(reference_baseline)이 등록돼 있으면 소유자·주소·근저당 일치 여부를 함께 비교한다.
 */
export const uploadAndAnalyzeBrokerageDocument = async (
  leaseCaseId: number,
  imageUri: string,
): Promise<BrokerageAnalysisResult> => {
  const formData = new FormData();
  formData.append("files", {
    uri: imageUri,
    name: "brokerage_document.jpg",
    type: "image/jpeg",
    // RN의 FormData 파일 객체는 DOM Blob 타입과 달라 캐스팅이 필요하다
  } as unknown as Blob);

  console.log(
    "[brokerageDocumentApi] POST",
    BROKERAGE_UPLOAD_ANALYZE_ENDPOINT,
    "leaseCaseId:",
    leaseCaseId,
    "files:",
    { field: "files", name: "brokerage_document.jpg", uri: imageUri },
  );

  try {
    // api 인스턴스 기본 헤더가 Content-Type: application/json이라, 이걸 명시적으로
    // multipart/form-data로 덮어써야 RN이 FormData를 보고 boundary를 붙여준다.
    const { data } = await api.post<BrokerageAnalysisResult>(
      BROKERAGE_UPLOAD_ANALYZE_ENDPOINT,
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
