import { create } from "zustand";

import type { RegistryAnalysisResult } from "../services/registryDocumentApi";
import type { BuildingLedgerAnalysis } from "../services/buildingLedgerApi";
import type { BrokerageAnalysisResult } from "../services/brokerageDocumentApi";
import type { LeaseContractAnalysisResult } from "../services/leaseContractDocumentApi";

type DocumentAnalysisState = {
  /** 등기부등본 업로드+분석(POST /api/documents/registry/upload-analyze) 결과. */
  registryAnalysis: RegistryAnalysisResult | null;
  setRegistryAnalysis: (result: RegistryAnalysisResult) => void;
  /** 건축물대장 업로드+분석(POST /api/documents/building-ledger/upload-analyze) 결과. */
  buildingLedgerAnalysis: BuildingLedgerAnalysis | null;
  setBuildingLedgerAnalysis: (result: BuildingLedgerAnalysis) => void;
  /** 중개대상물 확인·설명서 업로드+분석(POST /api/documents/brokerage-document/upload-analyze) 결과. */
  brokerageAnalysis: BrokerageAnalysisResult | null;
  setBrokerageAnalysis: (result: BrokerageAnalysisResult) => void;
  /** 임대차계약서 업로드+분석(POST /api/documents/lease-contract/upload-analyze) 결과. */
  leaseContractAnalysis: LeaseContractAnalysisResult | null;
  setLeaseContractAnalysis: (result: LeaseContractAnalysisResult) => void;
};

/**
 * analyzing.tsx(업로드+분석 호출)와 document-result.tsx(결과 표시)가 서로 다른
 * 네비게이션 컨텍스트(스택)에 있어서 분석 결과를 공유하기 위한 스토어.
 */
export const useDocumentAnalysisStore = create<DocumentAnalysisState>(
  (set) => ({
    registryAnalysis: null,
    setRegistryAnalysis: (result) => set({ registryAnalysis: result }),
    buildingLedgerAnalysis: null,
    setBuildingLedgerAnalysis: (result) =>
      set({ buildingLedgerAnalysis: result }),
    brokerageAnalysis: null,
    setBrokerageAnalysis: (result) => set({ brokerageAnalysis: result }),
    leaseContractAnalysis: null,
    setLeaseContractAnalysis: (result) =>
      set({ leaseContractAnalysis: result }),
  }),
);
