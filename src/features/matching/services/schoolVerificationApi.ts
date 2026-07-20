import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const SEND_ENDPOINT = "/api/matches/school-verification/send";
const CONFIRM_ENDPOINT = "/api/matches/school-verification/confirm";

/** 학교 이메일 도메인이 지원 대상인지 확인 후 인증 코드를 발송한다 (Redis에 5분간 저장). */
export const sendSchoolVerificationCode = async (
  schoolEmail: string,
): Promise<void> => {
  try {
    await api.post(SEND_ENDPOINT, { schoolEmail });
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
 * 발송된 인증 코드를 확인한다. 성공하면 서버가 사용자의 schoolId/schoolVerified를
 * 갱신하므로, 호출부는 성공 후 getMyProfile()로 최신 값을 다시 불러와야 한다.
 */
export const confirmSchoolVerificationCode = async (
  schoolEmail: string,
  code: string,
): Promise<void> => {
  try {
    await api.post(CONFIRM_ENDPOINT, { schoolEmail, code });
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
