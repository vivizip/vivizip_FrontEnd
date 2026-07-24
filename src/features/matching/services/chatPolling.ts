import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";
import type { ChatMessage } from "./chatApi";

const CHAT_ROOMS_ENDPOINT = "/api/chat/rooms";

const toChatMessages = (payload: unknown): ChatMessage[] => {
  if (Array.isArray(payload)) return payload as ChatMessage[];
  if (!payload || typeof payload !== "object") return [];

  const value = payload as {
    messages?: unknown;
    data?: unknown;
    result?: unknown;
  };

  if (Array.isArray(value.messages)) return value.messages as ChatMessage[];
  if (Array.isArray(value.data)) return value.data as ChatMessage[];
  if (Array.isArray(value.result)) return value.result as ChatMessage[];

  if (value.result && typeof value.result === "object") {
    return toChatMessages(value.result);
  }
  if (value.data && typeof value.data === "object") {
    return toChatMessages(value.data);
  }
  return [];
};

const withErrorMessage = async <T>(request: () => Promise<T>): Promise<T> => {
  try {
    return await request();
  } catch (err) {
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<never> | undefined;
      if (envelope?.message) throw new Error(envelope.message);
    }
    throw err;
  }
};

export const getInitialChatMessages = (
  roomId: number,
): Promise<ChatMessage[]> =>
  withErrorMessage(async () => {
    const { data } = await api.get<unknown>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/messages`,
    );
    return toChatMessages(data);
  });

export const pollChatMessages = (
  roomId: number,
  afterId: number,
): Promise<ChatMessage[]> =>
  withErrorMessage(async () => {
    const { data } = await api.get<unknown>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/messages/poll`,
      { params: { afterId } },
    );
    return toChatMessages(data);
  });

export const postChatMessage = (
  roomId: number,
  content: string,
): Promise<ChatMessage | null> =>
  withErrorMessage(async () => {
    const { data } = await api.post<ChatMessage | null>(
      `${CHAT_ROOMS_ENDPOINT}/${roomId}/messages`,
      { content },
    );
    return data;
  });
