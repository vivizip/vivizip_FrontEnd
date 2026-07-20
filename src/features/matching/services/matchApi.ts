import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";
import type { TimeSlotDay, TimeSlotPeriod } from "./matchingOnboardingApi";

const MATCH_ENDPOINT = "/api/matches";
const MATCH_STATUS_ENDPOINT = "/api/matches/status";
const MATCH_RESULT_ENDPOINT = "/api/matches/result";

export type MatchStatusValue = "NOT_APPLIED" | "APPLIED_NOT_MATCHED" | "MATCHED";

export type MatchCounterpartTimeSlot = {
  day: TimeSlotDay;
  period: TimeSlotPeriod;
};

export type MatchResult = {
  matchId: number;
  chatRoomId: number;
  studentId: number;
  studentName: string;
  studentProfileImage: string | null;
  supporterId: number;
  supporterName: string;
  supporterProfileImage: string | null;
  status: string;
  counterpartNationality: string;
  counterpartGender: string;
  // 상대가 서포터즈면 항상 null (서포터즈 온보딩에는 한국어 수준 항목이 없음).
  counterpartKoreanLevel: string | null;
  counterpartTimeSlots: MatchCounterpartTimeSlot[];
};

/**
 * 로그인한 유학생이 같은 학교의 서포터즈 중 시간대가 겹치는 후보를 찾아 점수가
 * 가장 높은 서포터즈와 매칭한다. 요청 바디 없음 - 서버가 로그인한 사용자의
 * 온보딩 정보를 그대로 사용한다. 유학생 온보딩 완료 화면에서만 호출한다.
 */
export const requestMatch = async (): Promise<MatchResult> => {
  try {
    const { data } = await api.post<MatchResult>(MATCH_ENDPOINT);
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

/**
 * 로그인한 사용자의 현재 MATCHED 상태 매칭 정보를 상대방 정보와 함께 조회한다.
 * MATCHED 상태가 아니면 조회할 매칭 자체가 없으므로, getMatchStatus()가
 * "MATCHED"를 반환할 때만 호출해야 한다.
 */
export const getMatchResult = async (): Promise<MatchResult> => {
  try {
    const { data } = await api.get<MatchResult>(MATCH_RESULT_ENDPOINT);
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

/**
 * 현재 매칭에 대해 재매칭을 요청한다. 기존 매칭은 취소되고 새 상대와 매칭되며,
 * 응답은 requestMatch/getMatchResult와 동일한 구조(새 matchId/chatRoomId 포함)로
 * 온다. 사용자당 최대 3회까지 가능.
 */
export const requestRematch = async (
  matchId: number,
  reason: string,
): Promise<MatchResult> => {
  try {
    const { data } = await api.post<MatchResult>(
      `${MATCH_ENDPOINT}/${matchId}/rematch`,
      { reason },
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

/** 로그인한 사용자의 매칭 진행 상태(신청 전/신청 후 매칭 전/매칭 후) 조회. */
export const getMatchStatus = async (): Promise<MatchStatusValue> => {
  try {
    const { data } = await api.get<{ status: MatchStatusValue }>(
      MATCH_STATUS_ENDPOINT,
    );
    return data.status;
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
