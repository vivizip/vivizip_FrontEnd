import { create } from "zustand";

import type { RegistryAnalysisResult } from "../services/registryDocumentApi";
import type { BuildingLedgerAnalysis } from "../services/buildingLedgerApi";

type DocumentAnalysisState = {
  /** 등기부등본 업로드+분석(POST /api/documents/registry/upload-analyze) 결과. */
  registryAnalysis: RegistryAnalysisResult | null;
  setRegistryAnalysis: (result: RegistryAnalysisResult) => void;
  /** 건축물대장 업로드+분석(POST /api/documents/building-ledger/upload-analyze) 결과. */
  buildingLedgerAnalysis: BuildingLedgerAnalysis | null;
  setBuildingLedgerAnalysis: (result: BuildingLedgerAnalysis) => void;
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
  }),
);
