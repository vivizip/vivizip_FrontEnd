import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const CHAT_ROOMS_ENDPOINT = "/api/chat/rooms";

export type ChatRoom = {
  roomId: number;
  supporterId: number;
  studentId: number;
  matchId: number;
  status: string;
  createdAt: string;
  /** 내가 아직 읽지 않은 메시지 수 */
  unreadCount: number;
};

export type ChatMessageType = "TEXT" | "IMAGE";

export type ChatMessage = {
  messageId: number;
  roomId: number;
  senderId: number;
  /** type이 IMAGE면 S3 이미지 URL */
  content: string;
  type: ChatMessageType;
  createdAt: string;
  /** 내가 보낸 메시지만 값이 있음(true/false). 상대가 보낸 메시지는 null. */
  isRead: boolean | null;
};

export type ChatMessagesPage = {
  /** 과거 -> 현재 순 정렬 */
  messages: ChatMessage[];
  nextCursor: number | null;
  hasNext: boolean;
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

/** 내 채팅방 목록. unreadCount로 뱃지를 표시한다. */
export const getChatRooms = (): Promise<ChatRoom[]> =>
  withErrorMessage(async () => {
    const { data } = await api.get<ChatRoom[]>(CHAT_ROOMS_ENDPOINT);
    return data;
  });

/**
 * 이전 메시지 커서 기반 조회. cursor 없으면 최신 size개, 있으면 그보다 이전
 * 메시지를 가져온다. 호출 시 서버가 자동으로 읽음 처리 + READ 이벤트를 브로드캐스트한다.
 */
export const getChatMessages = (
  roomId: number,
  params?: { cursor?: number; size?: number },
): Promise<ChatMessagesPage> =>
  withErrorMessage(async () => {
    const { data } = await api.get<ChatMessagesPage>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/messages`,
      { params },
    );
    return data;
  });

/** 이미지 전송(JPEG/PNG/WEBP, 최대 10MB). 응답은 일반 메시지와 동일한 형태(type: "IMAGE"). */
export const sendChatImage = (
  roomId: number,
  imageUri: string,
): Promise<ChatMessage> =>
  withErrorMessage(async () => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "chat_image.jpg",
      type: "image/jpeg",
    } as unknown as Blob);

    const { data } = await api.post<ChatMessage>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/images`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      },
    );
    return data;
  });
