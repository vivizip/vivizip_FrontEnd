import { Client, type IMessage } from "@stomp/stompjs";

import { getAccessToken } from "../../../lib/tokenStorage";

// EXPO_PUBLIC_API_URL(https://...)에서 ws:// 스킴으로 변환 - 가이드가 ws(비TLS)로 명시함
const baseURL = process.env.EXPO_PUBLIC_API_URL;
const CHAT_WS_URL = baseURL ? `${baseURL.replace(/^https?/, "ws")}/ws` : undefined;

export type ChatTextOrImageEvent = {
  messageId: number;
  roomId: number;
  senderId: number;
  content: string;
  type: "TEXT" | "IMAGE";
  createdAt: string;
  isRead: boolean | null;
};

export type ChatReadEvent = {
  type: "READ";
  readerId: number;
  lastReadMessageId: number;
};

export type ChatSocketEvent = ChatTextOrImageEvent | ChatReadEvent;

const FALLBACK_CONNECT_ERROR = "채팅 연결에 실패했어요. 다시 시도해주세요.";

let client: Client | null = null;
let connectPromise: Promise<void> | null = null;

const getOrCreateClient = (): Client => {
  if (client) return client;
  const instance = new Client({
    brokerURL: CHAT_WS_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    // 재연결마다 최신 accessToken을 다시 읽어 CONNECT 헤더에 반영한다(토큰 재발급 대응).
    beforeConnect: async () => {
      const accessToken = await getAccessToken();
      instance.connectHeaders = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    },
  });
  client = instance;
  return instance;
};

/** 채팅 화면 마운트 시 호출. 이미 연결돼 있으면 즉시 resolve된다. */
export const connectChatSocket = (): Promise<void> => {
  const instance = getOrCreateClient();
  if (instance.connected) return Promise.resolve();
  if (connectPromise) return connectPromise;

  connectPromise = new Promise((resolve, reject) => {
    instance.onConnect = () => {
      connectPromise = null;
      resolve();
    };
    instance.onStompError = (frame) => {
      connectPromise = null;
      console.log("[chatSocket] STOMP error:", frame.headers?.message);
      reject(new Error(frame.headers?.message ?? FALLBACK_CONNECT_ERROR));
    };
    instance.activate();
  });
  return connectPromise;
};

/** 채팅 화면을 완전히 벗어날 때 호출(연결 종료). */
export const disconnectChatSocket = () => {
  client?.deactivate();
};

/** /sub/chat/{roomId} 구독. 반환 함수를 호출하면 구독이 해제된다. */
export const subscribeChatRoom = (
  roomId: number,
  onEvent: (event: ChatSocketEvent) => void,
): (() => void) => {
  const instance = getOrCreateClient();
  const subscription = instance.subscribe(
    `/sub/chat/${roomId}`,
    (message: IMessage) => {
      onEvent(JSON.parse(message.body) as ChatSocketEvent);
    },
  );
  return () => subscription.unsubscribe();
};

/** /pub/chat/{roomId}로 텍스트 메시지 발행. */
export const sendChatMessage = (roomId: number, content: string) => {
  const instance = getOrCreateClient();
  instance.publish({
    destination: `/pub/chat/${roomId}`,
    body: JSON.stringify({ content }),
  });
};
