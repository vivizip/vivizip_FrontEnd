import { create } from "zustand";

import type { RegistryAnalysisResult } from "../services/registryDocumentApi";
import type { BuildingLedgerAnalysis } from "../services/buildingLedgerApi";
import type { BrokerageAnalysisResult } from "../services/brokerageDocumentApi";
import type { LeaseContractAnalysisResult } from "../services/leaseContractDocumentApi";

type DocumentAnalysisState = {
  /**
   * 집(leaseCaseId, useRegisteredHouseStore의 currentHouseId)별 분석 결과 캐시.
   * house 구분 없이 단일 값으로 캐싱하면 다른 집으로 전환해도 이전 집의 분석
   * 결과가 그대로 남아 보이는 문제가 있어 house별로 분리해서 저장한다.
   */
  /** 등기부등본 업로드+분석(POST /api/documents/registry/upload-analyze) 결과. */
  registryAnalysisByHouse: Record<string, RegistryAnalysisResult>;
  setRegistryAnalysis: (houseId: string, result: RegistryAnalysisResult) => void;
  /** 건축물대장 업로드+분석(POST /api/documents/building-ledger/upload-analyze) 결과. */
  buildingLedgerAnalysisByHouse: Record<string, BuildingLedgerAnalysis>;
  setBuildingLedgerAnalysis: (houseId: string, result: BuildingLedgerAnalysis) => void;
  /** 중개대상물 확인·설명서 업로드+분석(POST /api/documents/brokerage-document/upload-analyze) 결과. */
  brokerageAnalysisByHouse: Record<string, BrokerageAnalysisResult>;
  setBrokerageAnalysis: (houseId: string, result: BrokerageAnalysisResult) => void;
  /** 임대차계약서 업로드+분석(POST /api/documents/lease-contract/upload-analyze) 결과. */
  leaseContractAnalysisByHouse: Record<string, LeaseContractAnalysisResult>;
  setLeaseContractAnalysis: (houseId: string, result: LeaseContractAnalysisResult) => void;
};

/**
 * analyzing.tsx(업로드+분석 호출)와 document-result.tsx(결과 표시)가 서로 다른
 * 네비게이션 컨텍스트(스택)에 있어서 분석 결과를 공유하기 위한 스토어.
 */
export const useDocumentAnalysisStore = create<DocumentAnalysisState>(
  (set) => ({
    registryAnalysisByHouse: {},
    setRegistryAnalysis: (houseId, result) =>
      set((state) => ({
        registryAnalysisByHouse: { ...state.registryAnalysisByHouse, [houseId]: result },
      })),
    buildingLedgerAnalysisByHouse: {},
    setBuildingLedgerAnalysis: (houseId, result) =>
      set((state) => ({
        buildingLedgerAnalysisByHouse: {
          ...state.buildingLedgerAnalysisByHouse,
          [houseId]: result,
        },
      })),
    brokerageAnalysisByHouse: {},
    setBrokerageAnalysis: (houseId, result) =>
      set((state) => ({
        brokerageAnalysisByHouse: { ...state.brokerageAnalysisByHouse, [houseId]: result },
      })),
    leaseContractAnalysisByHouse: {},
    setLeaseContractAnalysis: (houseId, result) =>
      set((state) => ({
        leaseContractAnalysisByHouse: {
          ...state.leaseContractAnalysisByHouse,
          [houseId]: result,
        },
      })),
  }),
);
