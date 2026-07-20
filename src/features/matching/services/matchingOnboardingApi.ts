import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

export type TimeSlotDay = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type TimeSlotPeriod = "MORNING" | "AFTERNOON" | "EVENING";

export type TimeSlotRequest = {
  day: TimeSlotDay;
  period: TimeSlotPeriod;
};

export type SupporterOnboardingRequest = {
  nationality: string;
  gender: string;
  timeSlots: TimeSlotRequest[];
};

export type StudentOnboardingRequest = {
  nationality: string;
  koreanLevel: string;
  gender: string;
  depositBudget: number;
  monthlyRentBudget: number;
  timeSlots: TimeSlotRequest[];
};

const SUPPORTER_ENDPOINT = "/api/matches/onboarding/supporter";
const STUDENT_ENDPOINT = "/api/matches/onboarding/student";

/**
 * 서포터즈 온보딩 등록. role이 서버에서 SUPPORTER로 설정되고, 기존에 등록된
 * timeSlots는 이번 요청 목록으로 전체 교체된다. 학교 인증 완료 사용자만 호출 가능.
 */
export const submitSupporterOnboarding = async (
  body: SupporterOnboardingRequest,
): Promise<void> => {
  try {
    await api.post(SUPPORTER_ENDPOINT, body);
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
 * 유학생 온보딩 등록. role이 서버에서 STUDENT로 설정되고, 기존에 등록된
 * timeSlots는 이번 요청 목록으로 전체 교체된다. 학교 인증 완료 사용자만 호출 가능.
 */
export const submitStudentOnboarding = async (
  body: StudentOnboardingRequest,
): Promise<void> => {
  try {
    await api.post(STUDENT_ENDPOINT, body);
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
