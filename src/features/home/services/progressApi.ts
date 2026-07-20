import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const PROGRESS_ENDPOINT = "/api/lease-cases/progress";

export type ProgressStep = 1 | 2 | 3;

export type ProgressResponse = {
  currentStep: ProgressStep;
  currentStepLabel: string;
};

/**
 * 로그인한 사용자의 부메랑 전체 진행 단계(1 메이트 매칭 / 2 집 구하는 중 /
 * 3 계약서 검토) 조회. 판단 기준은 전부 서버가 계산해서 주므로 프론트는
 * currentStep을 그대로 표시만 하면 된다.
 */
export const getBoomerangProgress = async (): Promise<ProgressResponse> => {
  try {
    const { data } = await api.get<ProgressResponse>(PROGRESS_ENDPOINT);
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
