import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const CHAT_ROOMS_ENDPOINT = "/api/chat/rooms";
const APPOINTMENTS_ENDPOINT = "/api/appointments";

export type AppointmentStatus = "SCHEDULED" | string;

export type Appointment = {
  appointmentId: number;
  chatRoomId: number;
  createdBy: number;
  /** "YYYY-MM-DDTHH:mm:ss" */
  scheduledAt: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  status: AppointmentStatus;
};

export type CreateAppointmentParams = {
  scheduledAt: string;
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
};

const withErrorMessage = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
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

/** 채팅방 안에서 약속을 생성한다. 생성 즉시 SCHEDULED로 확정되며 수락/거절 절차는 없다. */
export const createAppointment = (
  roomId: number,
  params: CreateAppointmentParams,
): Promise<Appointment> =>
  withErrorMessage(async () => {
    const { data } = await api.post<Appointment>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/appointments`,
      params,
    );
    return data;
  });

/** 채팅방의 약속 목록을 최신 일정순으로 조회한다. */
export const getAppointments = (roomId: number): Promise<Appointment[]> =>
  withErrorMessage(async () => {
    const { data } = await api.get<Appointment[]>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/appointments`,
    );
    return data;
  });

/** 약속 단건 상세 조회. */
export const getAppointmentDetail = (
  appointmentId: number,
): Promise<Appointment> =>
  withErrorMessage(async () => {
    const { data } = await api.get<Appointment>(
      `${APPOINTMENTS_ENDPOINT}/${appointmentId}`,
    );
    return data;
  });
