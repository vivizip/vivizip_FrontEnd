import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../../../components/TopBar";
import BottomSheet, {
  type BottomSheetItem,
} from "../../../../components/BottomSheet";
import AppointmentSheet from "./AppointmentSheet";
import AppointmentCard from "./AppointmentCard";
import LocationSearchSheet, { type SelectedPlace } from "./LocationSearchSheet";
import CancelMatchSheet from "./CancelMatchSheet";
import AttachmentMenu from "./AttachmentMenu";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { useAuthUserStore } from "../../../auth/store/useAuthUserStore";
import { getMatchResult, requestRematch } from "../../services/matchApi";
import { sendChatImage, type ChatMessage } from "../../services/chatApi";
import {
  getInitialChatMessages,
  pollChatMessages,
  postChatMessage,
} from "../../services/chatPolling";
import {
  createAppointment,
  getAppointmentDetail,
  getAppointments,
  type Appointment,
} from "../../services/appointmentApi";
import { useToastStore } from "../../../../store/useToastStore";

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx와 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;
const POLL_INTERVAL_MS = 2000;
const FALLBACK_LOAD_ERROR = "메시지를 불러오지 못했어요.";
const FALLBACK_CONNECT_ERROR = "채팅 연결에 실패했어요. 다시 시도해주세요.";
const FALLBACK_IMAGE_ERROR = "사진 전송에 실패했어요. 다시 시도해주세요.";
const FALLBACK_SEND_MESSAGE_ERROR = "메시지 전송에 실패했어요. 다시 시도해주세요.";
const FALLBACK_APPOINTMENT_LOAD_ERROR = "약속 정보를 불러오지 못했어요.";
const FALLBACK_APPOINTMENT_CREATE_ERROR = "약속 생성에 실패했어요. 다시 시도해주세요.";
const FALLBACK_NAME = "대화 상대";

// 약속잡기/장소검색 두 바텀시트가 같은 슬라이드업+오버레이 애니메이션을 쓰기 때문에 훅으로 뺐다.
function useSlideUpSheet() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.25,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, overlayOpacity, sheetTranslateY]);

  const open = () => setIsOpen(true);
  const close = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_OFFSCREEN_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMounted(false);
      setIsOpen(false);
    });
  };

  return { isMounted, open, close, overlayOpacity, sheetTranslateY };
}

const backIcon = require("../../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../../assets/icons/ic_kebab.png");
const plusIcon = require("../../../../../assets/icons/ic_plus.png");
const calendarIcon = require("../../../../../assets/icons/lucide_calendar.png");
const homeIcon = require("../../../../../assets/icons/ic_home_default.png");
const sendIconOn = require("../../../../../assets/icons/ic_on_send.png");
const sendIconOff = require("../../../../../assets/icons/ic_off_send.png");
const profileIcon = require("../../../../../assets/icons/icon_profile.png");
const xIcon = require("../../../../../assets/icons/ic_x.png");

// TODO(매칭 프로필 API 미구현): MatchResult에 학교 정보가 없어 목업 유지.
const MOCK_MATE = {
  school: "광운대학교 컴퓨터공학과",
};

type DisplayMessage = ChatMessage & { sender: "me" | "mate" };

type MessageGroup = {
  sender: "me" | "mate";
  messages: DisplayMessage[];
};

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatRoomDateBadge = (date: Date) => {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일`;
};

const formatMessageTime = (date: Date) => {
  const hours24 = date.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${period} ${hours12}:${minutes}`;
};

const formatAppointmentCardDate = (date: Date) => {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일`;
};

const formatAppointmentCardTime = (time: Date) => {
  const hours24 = time.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${period} ${hours12}시 ${minutes}분`;
};

// 같은 "분"인지 비교하는 키 (초 단위는 무시)
const getMinuteKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

// 연속된 같은 발신자 메시지를 하나의 그룹(아바타/이름 헤더 공유)으로 묶는다.
const groupMessages = (messages: DisplayMessage[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];
  messages.forEach((message) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.sender === message.sender) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ sender: message.sender, messages: [message] });
    }
  });
  return groups;
};

/**
 * 부메랑 메이트와의 1:1 채팅방 (Figma node 1119:17326, "채팅방" - 대화 진행 중 상태).
 * REST(GET /api/chat/rooms/{roomId}/messages, 커서 페이징)로 이전 메시지를 불러오고,
 * WebSocket STOMP(/sub/chat/{roomId} 구독, /pub/chat/{roomId} 발행)로 실시간 송수신한다.
 * roomId는 채팅 목록에서 넘어오면 라우트 파라미터로, 홈 배너에서 바로 들어오면
 * lastMatch.chatRoomId로 판단한다.
 * 카카오톡처럼 같은 발신자가 같은 분(分)에 연달아 보낸 메시지는 마지막 메시지에만 시간을 표시한다.
 * "약속잡기"는 POST /api/chat/rooms/{roomId}/appointments로 생성되며(수락/거절 없이 즉시
 * SCHEDULED 확정), 진입 시 GET .../appointments 목록에서 가장 최근 생성된 건을 GET
 * /api/appointments/{id}로 상세 조회해 상단 고정 카드(AppointmentCard)로 보여준다.
 * 채팅 메시지 자체는 API가 자동으로 남기지 않아, 확정 시 구조화된 문구를 별도로 전송한다.
 */
export default function MateChatScreen() {
  const router = useRouter();
  const { roomId: roomIdParam } = useLocalSearchParams<{ roomId?: string }>();
  const houseFoundAt = useMatchingApplicationStore((state) => state.houseFoundAt);
  const markHouseFound = useMatchingApplicationStore((state) => state.markHouseFound);
  const unmarkHouseFound = useMatchingApplicationStore(
    (state) => state.unmarkHouseFound,
  );
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const setLastMatch = useMatchingApplicationStore((state) => state.setLastMatch);
  const myUserId = useAuthUserStore((state) => state.user?.id) ?? null;

  const roomId = roomIdParam ? Number(roomIdParam) : (lastMatch?.chatRoomId ?? null);
  const isCurrentMatch = !!lastMatch && lastMatch.chatRoomId === roomId;
  const isMeStudent =
    myUserId != null &&
    lastMatch != null &&
    Number(myUserId) === Number(lastMatch.studentId);
  const isMeSupporter =
    myUserId != null &&
    lastMatch != null &&
    Number(myUserId) === Number(lastMatch.supporterId);
  const hasMatchedRoom = isCurrentMatch && (isMeStudent || isMeSupporter);
  const mateName = hasMatchedRoom
    ? isMeStudent
      ? lastMatch!.supporterName
      : isMeSupporter
        ? lastMatch!.studentName
        : FALLBACK_NAME
    : FALLBACK_NAME;
  const mateInfoRows: { label: string; value: string }[] = hasMatchedRoom
    ? [
        { label: "국적", value: lastMatch!.counterpartNationality },
        { label: "성별", value: lastMatch!.counterpartGender },
        ...(lastMatch!.counterpartKoreanLevel
          ? [{ label: "한국어 수준", value: lastMatch!.counterpartKoreanLevel }]
          : []),
      ]
    : [];

  const [isSubmittingRematch, setIsSubmittingRematch] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [appointmentDate, setAppointmentDate] = useState(() => new Date());
  const [appointmentTime, setAppointmentTime] = useState(() => new Date());
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlace | null>(null);
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const appointmentSheet = useSlideUpSheet();
  const locationSheet = useSlideUpSheet();
  const menuSheet = useSlideUpSheet();
  const mateProfileSheet = useSlideUpSheet();
  const cancelMatchSheet = useSlideUpSheet();
  const [cancelReason, setCancelReason] = useState("");
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [attachMenuAnchor, setAttachMenuAnchor] = useState({
    left: 0,
    bottom: 0,
  });
  const attachButtonRef = useRef<View>(null);

  useEffect(() => {
    if (!roomId || hasMatchedRoom) return;
    let cancelled = false;
    getMatchResult()
      .then((match) => {
        if (!cancelled) setLastMatch(match);
      })
      .catch(() => {
        // 메시지 조회와 별개로 처리하며, 이름은 fallback을 유지한다.
      });
    return () => {
      cancelled = true;
    };
  }, [hasMatchedRoom, roomId, setLastMatch]);

  // 최초 진입 시 최신 메시지 조회 (서버가 자동으로 읽음 처리 + READ 이벤트 브로드캐스트)
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    let lastMessageId = 0;
    let pollTimer: ReturnType<typeof setInterval> | null = null;

    const poll = async () => {
      try {
        const [incoming, latestMessages] = await Promise.all([
          pollChatMessages(roomId, lastMessageId),
          // afterId polling은 신규 메시지만 반환할 수 있으므로 기존 메시지의
          // isRead 변경도 함께 동기화한다.
          getInitialChatMessages(roomId),
        ]);
        if (cancelled) return;
        const receivedMessages = [...incoming, ...latestMessages];
        if (receivedMessages.length === 0) return;

        setMessages((previous) => {
          // receivedMessages 자체에 같은 messageId가 중복될 수 있어(incoming과
          // latestMessages가 겹치는 구간이 있음) - Map으로 messageId당 하나만
          // 남겨야 화면에 같은 메시지가 두 번 그려지고 key가 중복되는 걸 막는다.
          const byId = new Map(previous.map((message) => [message.messageId, message]));
          for (const message of receivedMessages) {
            byId.set(message.messageId, {
              ...byId.get(message.messageId),
              ...message,
            });
          }
          return Array.from(byId.values()).sort(
            (a, b) => a.messageId - b.messageId,
          );
        });
        lastMessageId = Math.max(
          lastMessageId,
          ...receivedMessages.map((message) => message.messageId),
        );
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      } catch (err) {
        if (!cancelled) {
          useToastStore
            .getState()
            .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
        }
      }
    };

    getInitialChatMessages(roomId)
      .then((initialMessages) => {
        if (cancelled) return;
        const sortedInitialMessages = [...initialMessages].sort(
          (a, b) => a.messageId - b.messageId,
        );
        setMessages(sortedInitialMessages);
        lastMessageId = sortedInitialMessages.reduce(
          (maxId, message) => Math.max(maxId, message.messageId),
          0,
        );
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        });
        pollTimer = setInterval(poll, POLL_INTERVAL_MS);
      })
      .catch((err) => {
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
      });
    return () => {
      cancelled = true;
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [roomId]);

  // WebSocket 연결 + 구독. TEXT/IMAGE는 목록에 추가(REST로 이미 추가된 낙관적 이미지 메시지는
  // messageId로 중복 제거), READ는 내가 보낸 메시지 중 lastReadMessageId 이하를 읽음 처리한다.
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;

    /* legacy WebSocket effect removed; polling owns this screen */
    /*
        // 화면을 나가면서 cleanup이 의도적으로 disconnectChatSocket()을 호출해도
        // 연결 시도 중이었다면 이 catch가 불린다 - cancelled면 실제 실패가 아니므로 무시한다.
        if (cancelled) return;
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_CONNECT_ERROR);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
      disconnectChatSocket();
    };
    */
  }, [roomId, myUserId]);

  const handleSelectLocation = (place: SelectedPlace) => {
    setSelectedPlace(place);
    locationSheet.close();
  };

  // 채팅방 진입/전환 시 이미 잡힌 약속이 있는지 확인하고, 있으면 가장 최근 생성된
  // 건(appointmentId가 가장 큰 것)을 상세 조회해 상단 카드로 보여준다.
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    (async () => {
      try {
        const list = await getAppointments(roomId);
        if (cancelled) return;
        if (list.length === 0) {
          setCurrentAppointment(null);
          return;
        }
        const latestCreated = list.reduce((latest, item) =>
          item.appointmentId > latest.appointmentId ? item : latest,
        );
        const detail = await getAppointmentDetail(latestCreated.appointmentId);
        if (!cancelled) setCurrentAppointment(detail);
      } catch (err) {
        if (!cancelled) {
          useToastStore
            .getState()
            .show(
              err instanceof Error ? err.message : FALLBACK_APPOINTMENT_LOAD_ERROR,
            );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const handlePressMateProfile = () => {
    menuSheet.close();
    mateProfileSheet.open();
  };

  const handlePressCancelMatch = () => {
    menuSheet.close();
    cancelMatchSheet.open();
  };

  const handleConfirmRematch = async () => {
    if (!lastMatch || isSubmittingRematch) return;
    setIsSubmittingRematch(true);
    try {
      const updated = await requestRematch(lastMatch.matchId, cancelReason.trim());
      setLastMatch(updated);
      setCancelReason("");
      cancelMatchSheet.close();
      useToastStore.getState().show("재매칭이 완료됐어요");
      router.replace("/home");
    } catch (err) {
      useToastStore
        .getState()
        .show(
          err instanceof Error ? err.message : "재매칭에 실패했어요. 다시 시도해주세요.",
        );
    } finally {
      setIsSubmittingRematch(false);
    }
  };

  const menuItems: BottomSheetItem[] = [
    {
      icon: profileIcon,
      label: "부메랑 유저 프로필 보기",
      onPress: handlePressMateProfile,
    },
    {
      icon: xIcon,
      label: "매칭 취소하기",
      onPress: handlePressCancelMatch,
    },
  ];

  // 키보드가 올라올 때 대화 말풍선도 하단(최신 메시지)이 보이도록 스크롤한다.
  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardDidShow", () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => subscription.remove();
  }, []);

  const handleSend = async () => {
    const text = draft.trim();
    console.log("[MateChatScreen] 전송 버튼 클릭, draft:", JSON.stringify(text), "roomId:", roomId);
    if (!text || !roomId) return;
    setDraft("");
    try {
      const message = await postChatMessage(roomId, text);
      if (message) {
        setMessages((previous) =>
          previous.some((item) => item.messageId === message.messageId)
            ? previous
            : [...previous, message].sort(
                (a, b) => a.messageId - b.messageId,
              ),
        );
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });
      }
    } catch (err) {
      // 전송 실패 시 입력창에 문구를 되돌려줘 다시 보낼 수 있게 한다.
      setDraft(text);
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SEND_MESSAGE_ERROR);
    }
  };

  const openAttachMenu = () => {
    attachButtonRef.current?.measureInWindow((x, y) => {
      const windowHeight = Dimensions.get("window").height;
      setAttachMenuAnchor({ left: x - 7, bottom: windowHeight - y - 8 });
      setIsAttachMenuOpen(true);
    });
  };

  const sendImage = async (uri: string) => {
    if (!roomId) return;
    try {
      const message = await sendChatImage(roomId, uri);
      setMessages((prev) =>
        prev.some((item) => item.messageId === message.messageId)
          ? prev
          : [...prev, message],
      );
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_IMAGE_ERROR);
    }
  };

  const handlePressCamera = async () => {
    setIsAttachMenuOpen(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      console.log("[MateChatScreen] camera permission denied");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) {
      sendImage(result.assets[0].uri);
    }
  };

  const handlePressGallery = async () => {
    setIsAttachMenuOpen(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      console.log("[MateChatScreen] media library permission denied");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) {
      sendImage(result.assets[0].uri);
    }
  };

  const handleConfirmAppointment = async () => {
    if (!roomId || !selectedPlace || isCreatingAppointment) return;
    setIsCreatingAppointment(true);
    try {
      const pad2 = (n: number) => String(n).padStart(2, "0");
      const scheduledAt = `${appointmentDate.getFullYear()}-${pad2(
        appointmentDate.getMonth() + 1,
      )}-${pad2(appointmentDate.getDate())}T${pad2(
        appointmentTime.getHours(),
      )}:${pad2(appointmentTime.getMinutes())}:00`;
      const created = await createAppointment(roomId, {
        scheduledAt,
        placeName: selectedPlace.name,
        placeAddress: selectedPlace.address,
        latitude: selectedPlace.latitude,
        longitude: selectedPlace.longitude,
      });
      setCurrentAppointment(created);
      appointmentSheet.close();
      // 약속 API가 채팅 메시지를 자동으로 남기지 않아, 대화 흐름에도 확정 안내를 남긴다.
      const text = [
        "📅 약속을 만들었어요",
        `날짜: ${formatAppointmentCardDate(appointmentDate)}`,
        `시간: ${formatAppointmentCardTime(appointmentTime)}`,
        `장소: ${selectedPlace.name}`,
      ].join("\n");
      // 약속 자체는 이미 생성됐으므로, 안내 메시지 전송 실패는 별도로 조용히 로그만 남긴다
      // (여기서 실패해도 "약속 생성 실패" 토스트로 잘못 안내하지 않기 위함).
      try {
        await postChatMessage(roomId, text);
      } catch (sendErr) {
        console.log("[MateChatScreen] appointment notice send failed:", sendErr);
      }
    } catch (err) {
      useToastStore
        .getState()
        .show(
          err instanceof Error ? err.message : FALLBACK_APPOINTMENT_CREATE_ERROR,
        );
    } finally {
      setIsCreatingAppointment(false);
    }
  };

  const displayMessages: DisplayMessage[] = messages.map((message) => ({
    ...message,
    sender:
      myUserId != null && Number(message.senderId) === Number(myUserId)
        ? "me"
        : "mate",
  }));
  const messageGroups = groupMessages(displayMessages);
  const roomDateBadge = messages[0]
    ? formatRoomDateBadge(new Date(messages[0].createdAt))
    : formatRoomDateBadge(new Date());

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title={mateName}
        leftIcon={backIcon}
        onPressLeft={() => router.replace("/chat")}
        rightIcon={kebabIcon}
        onPressRight={menuSheet.open}
      />

      {currentAppointment && (
        <View className="w-full px-4 pt-2">
          <AppointmentCard appointment={currentAppointment} />
        </View>
      )}

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{
            gap: 20,
            paddingHorizontal: 16,
            paddingTop: 8,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full items-center">
            <View className="items-center justify-center rounded-2xl bg-[#FAFAFD] px-2.5 py-1">
              <Text className="font-pretendard text-12 leading-4 text-gray-700">
                {roomDateBadge}
              </Text>
            </View>
          </View>

          {messages.length === 0 ? (
            <View className="w-full items-center">
              <View className="w-[172px] items-center justify-center rounded-2xl bg-[#FAFAFD] px-4 py-3">
                <Text className="text-center font-pretendard text-12 leading-4 text-gray-700">
                  부메랑 메이트가 매칭되었어요{"\n"}인사를 나누고 약속을
                  잡아보세요
                </Text>
              </View>
            </View>
          ) : (
            messageGroups.map((group, groupIndex) => {
              if (group.sender === "mate") {
                return (
                  <View
                    key={groupIndex}
                    className="w-full flex-row items-start gap-2"
                  >
                    <View className="h-8 w-8 rounded-full bg-[#E6E6EB]" />
                    <View className="flex-1 gap-1 pr-2">
                      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
                        {mateName}
                      </Text>
                      <View className="items-start gap-1.5">
                        {group.messages.map((message, messageIndex) => {
                          const nextMessage = group.messages[messageIndex + 1];
                          const sentAt = new Date(message.createdAt);
                          const showTime =
                            !nextMessage ||
                            getMinuteKey(new Date(nextMessage.createdAt)) !==
                              getMinuteKey(sentAt);
                          return (
                            <View
                              key={message.messageId}
                              className="flex-row items-end gap-1"
                            >
                              {message.type === "IMAGE" ? (
                                <Image
                                  source={{ uri: message.content }}
                                  className="h-[180px] w-[180px] rounded-2xl"
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="max-w-[226px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-gray-50 px-3 py-2">
                                  <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                                    {message.content}
                                  </Text>
                                </View>
                              )}
                              {showTime && (
                                <Text className="font-pretendard text-12 leading-4 text-gray-600">
                                  {formatMessageTime(sentAt)}
                                </Text>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                );
              }

              return (
                <View key={groupIndex} className="w-full items-end gap-2">
                  {group.messages.map((message, messageIndex) => {
                    const nextMessage = group.messages[messageIndex + 1];
                    const sentAt = new Date(message.createdAt);
                    const showTime =
                      !nextMessage ||
                      getMinuteKey(new Date(nextMessage.createdAt)) !==
                        getMinuteKey(sentAt);
                    const showUnread = message.isRead !== true;
                    return (
                      <View
                        key={message.messageId}
                        className="flex-row items-end gap-1"
                      >
                        <View className="items-end gap-0.5">
                          {showUnread && (
                            <Text className="font-pretendard-semibold text-11 font-semibold leading-3 text-primary-500">
                              1
                            </Text>
                          )}
                          {showTime && (
                            <Text className="font-pretendard text-12 leading-4 text-gray-600">
                              {formatMessageTime(sentAt)}
                            </Text>
                          )}
                        </View>
                        {message.type === "IMAGE" ? (
                          <Image
                            source={{ uri: message.content }}
                            className="h-[180px] w-[180px] rounded-2xl"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="max-w-[272px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl border border-gray-200 bg-white px-3 py-2">
                            <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                              {message.content}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })
          )}
        </ScrollView>

        <View className="w-full gap-1 bg-white">
          {!isComposerFocused && (
            <View className="w-full flex-row gap-2 px-4">
              <Pressable
                onPress={appointmentSheet.open}
                className="h-8 flex-row items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="약속잡기"
              >
                <Image
                  source={calendarIcon}
                  className="h-4 w-4"
                  resizeMode="contain"
                />
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                  약속잡기
                </Text>
              </Pressable>
              <Pressable
                onPress={houseFoundAt ? unmarkHouseFound : markHouseFound}
                className={`h-8 flex-row items-center justify-center gap-1.5 rounded-full border px-3 active:opacity-70 ${
                  houseFoundAt
                    ? "border-primary-500 bg-primary-500"
                    : "border-gray-200 bg-white"
                }`}
                accessibilityRole="button"
                accessibilityLabel="집 구하기 완료"
              >
                <Image
                  source={homeIcon}
                  className="h-4 w-4"
                  resizeMode="contain"
                  style={houseFoundAt ? { tintColor: "#FFFFFF" } : undefined}
                />
                <Text
                  className={`font-pretendard-semibold text-14 font-semibold leading-[22px] ${
                    houseFoundAt ? "text-white" : "text-gray-800"
                  }`}
                >
                  집 구하기 완료
                </Text>
              </Pressable>
            </View>
          )}

          <View className="w-full flex-row items-end px-4 pb-2 pt-2.5">
            <View className="w-full flex-row items-end gap-2 rounded-3xl bg-gray-50 p-2">
              <View ref={attachButtonRef} collapsable={false}>
                <Pressable
                  onPress={openAttachMenu}
                  className="h-[34px] w-[34px] items-center justify-center rounded-full bg-white active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="첨부"
                >
                  <Image
                    source={plusIcon}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                </Pressable>
              </View>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                onFocus={() => setIsComposerFocused(true)}
                onBlur={() => setIsComposerFocused(false)}
                placeholder="메시지를 입력하세요"
                placeholderTextColor="#9FA5AF"
                multiline
                className="max-h-24 flex-1 items-center justify-center py-2 font-pretendard-medium text-16 font-medium text-gray-800"
              />
              <Pressable
                onPress={handleSend}
                disabled={draft.trim().length === 0}
                className="h-[34px] w-[34px] items-center justify-center rounded-full bg-white active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="전송"
              >
                <Image
                  source={draft.trim().length === 0 ? sendIconOff : sendIconOn}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={isAttachMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAttachMenuOpen(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setIsAttachMenuOpen(false)}
        >
          <View
            style={{
              position: "absolute",
              left: attachMenuAnchor.left,
              bottom: attachMenuAnchor.bottom,
            }}
          >
            <AttachmentMenu
              onPressCamera={handlePressCamera}
              onPressGallery={handlePressGallery}
            />
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={appointmentSheet.isMounted}
        transparent
        animationType="none"
        onRequestClose={appointmentSheet.close}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: appointmentSheet.overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={appointmentSheet.close}
          />
          <Animated.View
            style={{
              transform: [{ translateY: appointmentSheet.sheetTranslateY }],
            }}
          >
            <BottomSheet>
              <AppointmentSheet
                date={appointmentDate}
                onChangeDate={setAppointmentDate}
                time={appointmentTime}
                onChangeTime={setAppointmentTime}
                location={selectedPlace?.name ?? null}
                onPressLocation={locationSheet.open}
                onConfirm={handleConfirmAppointment}
                isSubmitting={isCreatingAppointment}
              />
            </BottomSheet>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={locationSheet.isMounted}
        transparent
        animationType="none"
        onRequestClose={locationSheet.close}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: locationSheet.overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={locationSheet.close}
          />
          <Animated.View
            style={{
              height: "66.66%",
              transform: [{ translateY: locationSheet.sheetTranslateY }],
            }}
          >
            <LocationSearchSheet onSelect={handleSelectLocation} />
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={menuSheet.isMounted}
        transparent
        animationType="none"
        onRequestClose={menuSheet.close}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: menuSheet.overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={menuSheet.close}
          />
          <Animated.View
            style={{ transform: [{ translateY: menuSheet.sheetTranslateY }] }}
          >
            <BottomSheet items={menuItems} />
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={mateProfileSheet.isMounted}
        transparent
        animationType="none"
        onRequestClose={mateProfileSheet.close}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: mateProfileSheet.overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={mateProfileSheet.close}
          />
          <Animated.View
            style={{
              transform: [{ translateY: mateProfileSheet.sheetTranslateY }],
            }}
          >
            <BottomSheet>
              <View className="w-full gap-6">
                <View className="w-full flex-row items-center gap-3">
                  <View className="h-[52px] w-[52px] rounded-full bg-[#E6E6EB]" />
                  <View className="flex-1 gap-1">
                    <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-black">
                      {mateName}
                    </Text>
                    <Text className="font-pretendard text-12 leading-4 text-black">
                      {MOCK_MATE.school}
                    </Text>
                  </View>
                </View>

                <View className="w-full gap-2">
                  {mateInfoRows.map((row) => (
                    <View
                      key={row.label}
                      className="w-full flex-row items-center gap-4"
                    >
                      <Text className="w-20 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-500">
                        {row.label}
                      </Text>
                      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                        {row.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </BottomSheet>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={cancelMatchSheet.isMounted}
        transparent
        animationType="none"
        onRequestClose={cancelMatchSheet.close}
      >
        {/* 시트 자체는 항상 하단에 고정. 키보드가 올라올 때 TextInput만 보이도록 올라오는
            처리는 CancelMatchSheet 내부 ScrollView가 담당한다(시트/버튼 위치는 안 움직임). */}
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: cancelMatchSheet.overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={cancelMatchSheet.close}
          />
          <Animated.View
            style={{
              transform: [{ translateY: cancelMatchSheet.sheetTranslateY }],
            }}
          >
            <BottomSheet>
              <CancelMatchSheet
                reason={cancelReason}
                onChangeReason={setCancelReason}
                onConfirmRematch={handleConfirmRematch}
                onCancel={cancelMatchSheet.close}
                isSubmitting={isSubmittingRematch}
              />
            </BottomSheet>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
