import { Client, type IMessage } from "@stomp/stompjs";

import { getAccessToken } from "../../../lib/tokenStorage";

// EXPO_PUBLIC_API_URL(https://...)에서 ws:// 스킴으로 변환 - 가이드가 ws(비TLS)로 명시함
// const baseURL = process.env.EXPO_PUBLIC_API_URL;
const baseURL = process.env.EXPO_PUBLIC_API_URL;
const CHAT_WS_URL = baseURL
  ? `${baseURL.replace(/^http/, "ws")}/ws`
  : undefined;

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
    debug: (str) => {
      console.log("[STOMP DEBUG]", str);
    },
    onConnect: (frame) => {
      console.log("[STOMP] ✅ onConnect 호출됨!", frame);
    },
    onStompError: (frame) => {
      console.log("[STOMP ERROR]", frame.headers["message"], frame.body);
    },
    onWebSocketError: (event) => {
      console.log("[WS ERROR]", event);
    },
    onWebSocketClose: (event) => {
      console.log("[WS CLOSE]", event.code, event.reason);
    },

    // 재연결마다 최신 accessToken을 다시 읽어 반영한다(토큰 재발급 대응).
    // 백엔드의 JwtAuthenticationFilter가 STOMP CONNECT 프레임이 아니라 WS 핸드셰이크(GET /ws)
    // 자체에서 토큰을 검사해서, 네이티브 WebSocket이 핸드셰이크에 커스텀 헤더를 못 싣는 문제를
    // 우회하기 위해 쿼리 파라미터(?token=)로 핸드셰이크 URL에 직접 실어 보낸다.
    beforeConnect: async () => {
      const accessToken = await getAccessToken();
      instance.connectHeaders = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
      instance.brokerURL =
        CHAT_WS_URL && accessToken
          ? `${CHAT_WS_URL}?token=${encodeURIComponent(accessToken)}`
          : CHAT_WS_URL;
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
    // WS 핸드셰이크 자체가 실패하면(예: 백엔드/프록시 설정 문제) STOMP 프로토콜까지
    // 못 가서 onStompError는 안 불리고 소켓만 닫힌다 - 그 경우 이 콜백들이 없으면
    // connectPromise가 영원히 pending 상태로 남아 sendChatMessage의 await가 멈춘다.
    instance.onWebSocketError = (event) => {
      if (!connectPromise) return;
      connectPromise = null;
      console.log("[chatSocket] WebSocket 연결 실패:", event);
      reject(new Error(FALLBACK_CONNECT_ERROR));
    };
    instance.onWebSocketClose = (event) => {
      if (!connectPromise) return;
      connectPromise = null;
      console.log(
        "[chatSocket] 연결 전 WebSocket 종료:",
        event.code,
        event.reason,
      );
      reject(new Error(FALLBACK_CONNECT_ERROR));
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
  console.log("[CHAT] 화면 진입, activate 호출");
  const instance = getOrCreateClient();
  const subscription = instance.subscribe(
    `/sub/chat/${roomId}`,
    (message: IMessage) => {
      onEvent(JSON.parse(message.body) as ChatSocketEvent);
    },
  );
  return () => subscription.unsubscribe();
};

/**
 * /pub/chat/{roomId}로 텍스트 메시지 발행.
 * publish() 시점에 연결이 끊겨 있으면(예: 화면 진입 직후 connectChatSocket이 아직 완료 전이거나,
 * myUserId 로딩 등으로 재연결 중인 순간) stompjs가 "no underlying STOMP connection" 에러를
 * 던지므로, 발행 전에 connectChatSocket()으로 연결 완료를 먼저 보장한다.
 */
export const sendChatMessage = async (
  roomId: number,
  content: string,
): Promise<void> => {
  await connectChatSocket();
  const instance = getOrCreateClient();
  const body = JSON.stringify({ content });
  console.log("[chatSocket] >>> PUBLISH", `/pub/chat/${roomId}`, body);
  instance.publish({
    destination: `/pub/chat/${roomId}`,
    body,
  });
};
