import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import LocationSearchSheet from "./LocationSearchSheet";
import CancelMatchSheet from "./CancelMatchSheet";
import AttachmentMenu from "./AttachmentMenu";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { useAuthUserStore } from "../../../auth/store/useAuthUserStore";
import { requestRematch } from "../../services/matchApi";
import {
  getChatMessages,
  sendChatImage,
  type ChatMessage,
} from "../../services/chatApi";
import {
  connectChatSocket,
  disconnectChatSocket,
  sendChatMessage,
  subscribeChatRoom,
  type ChatSocketEvent,
} from "../../services/chatSocket";
import { useToastStore } from "../../../../store/useToastStore";

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx와 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;
const MESSAGE_PAGE_SIZE = 30;
const FALLBACK_LOAD_ERROR = "메시지를 불러오지 못했어요.";
const FALLBACK_CONNECT_ERROR = "채팅 연결에 실패했어요. 다시 시도해주세요.";
const FALLBACK_IMAGE_ERROR = "사진 전송에 실패했어요. 다시 시도해주세요.";
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
 * "약속잡기"는 백엔드에 전용 메시지 타입이 없어, 확정 시 구조화된 문구를 일반 텍스트로 전송한다.
 */
export default function MateChatScreen() {
  const router = useRouter();
  const { roomId: roomIdParam } = useLocalSearchParams<{ roomId?: string }>();
  const houseFoundAt = useMatchingApplicationStore((state) => state.houseFoundAt);
  const markHouseFound = useMatchingApplicationStore((state) => state.markHouseFound);
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const setLastMatch = useMatchingApplicationStore((state) => state.setLastMatch);
  const role = useMatchingApplicationStore((state) => state.role);
  const myUserId = useAuthUserStore((state) => state.user?.id) ?? null;

  const roomId = roomIdParam ? Number(roomIdParam) : (lastMatch?.chatRoomId ?? null);
  const isCurrentMatch = !!lastMatch && lastMatch.chatRoomId === roomId;
  const mateName = isCurrentMatch
    ? role === "supporter"
      ? lastMatch!.studentName
      : lastMatch!.supporterName
    : FALLBACK_NAME;
  const mateInfoRows: { label: string; value: string }[] = isCurrentMatch
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
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [draft, setDraft] = useState("");
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [appointmentDate, setAppointmentDate] = useState(() => new Date());
  const [appointmentTime, setAppointmentTime] = useState(() => new Date());
  const [appointmentLocation, setAppointmentLocation] =
    useState("명동역 8번 출구");
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

  // 최초 진입 시 최신 메시지 조회 (서버가 자동으로 읽음 처리 + READ 이벤트 브로드캐스트)
  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    getChatMessages(roomId, { size: MESSAGE_PAGE_SIZE })
      .then((page) => {
        if (cancelled) return;
        setMessages(page.messages);
        setHasMoreHistory(page.hasNext);
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        });
      })
      .catch((err) => {
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const handleLoadMoreHistory = useCallback(async () => {
    if (!roomId || isLoadingMore || !hasMoreHistory || messages.length === 0) {
      return;
    }
    setIsLoadingMore(true);
    try {
      const oldestId = messages[0].messageId;
      const page = await getChatMessages(roomId, {
        cursor: oldestId,
        size: MESSAGE_PAGE_SIZE,
      });
      setMessages((prev) => [...page.messages, ...prev]);
      setHasMoreHistory(page.hasNext);
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
    } finally {
      setIsLoadingMore(false);
    }
  }, [roomId, isLoadingMore, hasMoreHistory, messages]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (event.nativeEvent.contentOffset.y < 40) {
      handleLoadMoreHistory();
    }
  };

  // WebSocket 연결 + 구독. TEXT/IMAGE는 목록에 추가(REST로 이미 추가된 낙관적 이미지 메시지는
  // messageId로 중복 제거), READ는 내가 보낸 메시지 중 lastReadMessageId 이하를 읽음 처리한다.
  useEffect(() => {
    if (!roomId) return;
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    const handleEvent = (event: ChatSocketEvent) => {
      if (event.type === "READ") {
        setMessages((prev) =>
          prev.map((message) =>
            message.senderId === myUserId &&
            message.messageId <= event.lastReadMessageId
              ? { ...message, isRead: true }
              : message,
          ),
        );
        return;
      }
      setMessages((prev) => {
        if (prev.some((message) => message.messageId === event.messageId)) {
          return prev;
        }
        return [...prev, event];
      });
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    };

    connectChatSocket()
      .then(() => {
        if (cancelled) return;
        unsubscribe = subscribeChatRoom(roomId, handleEvent);
      })
      .catch((err) => {
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_CONNECT_ERROR);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
      disconnectChatSocket();
    };
  }, [roomId, myUserId]);

  const handleSelectLocation = (location: string) => {
    setAppointmentLocation(location);
    locationSheet.close();
  };

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

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !roomId) return;
    sendChatMessage(roomId, text);
    setDraft("");
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

  const handleConfirmAppointment = () => {
    if (!roomId) return;
    const text = [
      "📅 약속을 만들었어요",
      `날짜: ${formatAppointmentCardDate(appointmentDate)}`,
      `시간: ${formatAppointmentCardTime(appointmentTime)}`,
      `장소: ${appointmentLocation}`,
    ].join("\n");
    sendChatMessage(roomId, text);
    appointmentSheet.close();
  };

  const displayMessages: DisplayMessage[] = messages.map((message) => ({
    ...message,
    sender: message.senderId === myUserId ? "me" : "mate",
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
          onScroll={handleScroll}
          scrollEventThrottle={200}
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
                onPress={markHouseFound}
                disabled={houseFoundAt !== null}
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
                location={appointmentLocation}
                onPressLocation={locationSheet.open}
                onConfirm={handleConfirmAppointment}
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
