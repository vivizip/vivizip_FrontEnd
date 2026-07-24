import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const LEASE_CASES_ENDPOINT = "/api/lease-cases";

export type LeaseCaseStatus = "ACTIVE" | string;

// 등기부등본+건축물대장 분석 완료 시 DURING_CONTRACT로, 중개대상물+임대차계약서
// 분석 완료 시 AFTER_CONTRACT로 자동 갱신된다(한 번 오른 단계는 내려가지 않음).
// "계약전" 초기값 문자열은 스펙에 명시되지 않아 앱 기존 용어(계약전/중/후)에 맞춰 추정함.
export type ContractStage = "BEFORE_CONTRACT" | "DURING_CONTRACT" | "AFTER_CONTRACT";

export type LeaseCase = {
  leaseCaseId: number;
  name: string;
  roadAddress: string;
  detailAddress: string;
  status: LeaseCaseStatus;
  contractStage: ContractStage;
  createdAt: string;
  updatedAt: string;
};

export type CreateLeaseCaseParams = {
  name: string;
  roadAddress: string;
  detailAddress: string;
};

export type LeaseCaseSummary = {
  leaseCaseId: number;
  name: string;
};

/** 주소 확정(집 등록) 시 임대차 케이스를 생성한다. */
export const createLeaseCase = async (
  params: CreateLeaseCaseParams,
): Promise<LeaseCase> => {
  try {
    const { data } = await api.post<LeaseCase>(LEASE_CASES_ENDPOINT, params);
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

/** 내 임대차 케이스 목록(id/name만)을 조회한다. */
export const getLeaseCases = async (): Promise<LeaseCaseSummary[]> => {
  try {
    const { data } = await api.get<LeaseCaseSummary[]>(LEASE_CASES_ENDPOINT);
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

/** 임대차 케이스 상세(주소 포함)를 조회한다. */
export const getLeaseCaseDetail = async (
  leaseCaseId: number,
): Promise<LeaseCase> => {
  try {
    const { data } = await api.get<LeaseCase>(
      `${LEASE_CASES_ENDPOINT}/${leaseCaseId}`,
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
