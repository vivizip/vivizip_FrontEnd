import { api } from "../../../lib/api";

/**
 * 스캔한 서류 이미지를 서버로 업로드해 분석을 요청한다.
 *
 * TODO(API 대기): 백엔드 API가 아직 없어 골격만 잡아둔 스텁.
 * 스펙이 나오면 아래를 실측 응답 기준으로 확정할 것 (로그인 API 때처럼 추측 금지):
 * - 엔드포인트 경로 (아래는 임시값)
 * - 응답 타입 (성공: 평평한 구조? / 실패: ApiEnvelope 봉투 - 기존 관례 확인)
 * - 문서 종류(등기부등본/건축물대장 등) 구분 파라미터
 */
const DOCUMENT_ANALYZE_ENDPOINT = "/api/documents/analyze"; // TODO: 실제 경로로 교체

export const uploadDocumentImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "document.jpg",
    type: "image/jpeg",
    // RN의 FormData 파일 객체는 DOM Blob 타입과 달라 캐스팅이 필요하다
  } as unknown as Blob);

  const { data } = await api.post(DOCUMENT_ANALYZE_ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// 등기부등본/건축물대장 - "앱에서 발급할래요" 선택 시 문서 종류
export type DocumentType = "registry" | "building";

/**
 * 앱 내 서류 발급을 요청한다. HouseSelector에 설정된 현재 주소를 함께 전달.
 *
 * TODO(API 대기): 백엔드 API가 아직 없어 골격만 잡아둔 스텁.
 * 스펙이 나오면 아래를 실측 응답 기준으로 확정할 것:
 * - 엔드포인트 경로 (아래는 임시값)
 * - 요청 바디 필드명(address 등)/응답 타입
 */
const DOCUMENT_ISSUE_ENDPOINT = "/api/documents/issue"; // TODO: 실제 경로로 교체

export const requestDocumentIssuance = async (
  documentType: DocumentType,
  address: string,
) => {
  const { data } = await api.post(DOCUMENT_ISSUE_ENDPOINT, {
    documentType,
    address,
  });
  return data;
};
