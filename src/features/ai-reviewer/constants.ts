/**
 * 서류 검토 화면의 단계별 문서 체크리스트 데이터.
 * 추후 백엔드 연동 시 이 구조 그대로 API 응답으로 대체 가능.
 */

export type ChecklistItem = {
  id: string;
  name: string;
};

export type ChecklistStep = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export const DOCUMENT_STEPS: ChecklistStep[] = [
  {
    id: "before",
    title: "계약전",
    items: [
      { id: "register", name: "등기부등본" },
      { id: "building", name: "건축물대장" },
    ],
  },
  {
    id: "during",
    title: "계약중",
    items: [
      { id: "brokerage", name: "중개대상물 확인 설명서" },
      { id: "lease-contract", name: "임대차 계약서" },
    ],
  },
  {
    id: "after",
    title: "계약 후",
    items: [
      { id: "move-in-report", name: "확정일자와 체류지 신고" },
      { id: "condition-record", name: "입주 상태 기록" },
    ],
  },
];
