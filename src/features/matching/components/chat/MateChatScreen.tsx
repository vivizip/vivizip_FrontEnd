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
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../../../components/TopBar";
import BottomSheet, {
  type BottomSheetItem,
} from "../../../../components/BottomSheet";
import AppointmentSheet from "./AppointmentSheet";
import LocationSearchSheet from "./LocationSearchSheet";
import MapPreview from "./MapPreview";
import CancelMatchSheet from "./CancelMatchSheet";
import AttachmentMenu from "./AttachmentMenu";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { requestRematch } from "../../services/matchApi";
import { useToastStore } from "../../../../store/useToastStore";

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx와 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

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

// TODO(1:1 매칭 미구현): 실제 매칭된 메이트 정보가 없어 목업으로 표시.
// BoomerangBannerCard의 메이트 확인 바텀시트와 같은 사람(값 동일)이다.
const MATE_NAME = "킴 응우옌";
const MOCK_MATE = {
  school: "광운대학교 컴퓨터공학과",
  nationality: "베트남 🇻🇳",
  gender: "남자",
  koreanLevel: "중급",
  availableTime: "금요일 저녁, 주말 오후",
};

const MATE_INFO_ROWS: { label: string; value: string }[] = [
  { label: "국적", value: MOCK_MATE.nationality },
  { label: "성별", value: MOCK_MATE.gender },
  { label: "한국어 수준", value: MOCK_MATE.koreanLevel },
  { label: "편한 시간", value: MOCK_MATE.availableTime },
];

type TextMessage = {
  id: string;
  kind: "text";
  text: string;
  sender: "me" | "mate";
  sentAt: Date;
};

type ImageMessage = {
  id: string;
  kind: "image";
  uri: string;
  sender: "me" | "mate";
  sentAt: Date;
};

// 아바타/이름 헤더를 공유하는 일반 대화 메시지(텍스트 + 사진)
type RegularMessage = TextMessage | ImageMessage;

type AppointmentMessage = {
  id: string;
  kind: "appointment";
  date: Date;
  time: Date;
  location: string;
  sentAt: Date;
};

type ChatMessage = RegularMessage | AppointmentMessage;

type MessageGroup =
  | {
      kind: "text";
      sender: RegularMessage["sender"];
      messages: RegularMessage[];
    }
  | { kind: "appointment"; message: AppointmentMessage };

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatRoomCreatedDate = (date: Date) => {
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

// 연속된 같은 발신자 텍스트 메시지를 하나의 그룹(아바타/이름 헤더 공유)으로 묶는다.
// 약속 확정 카드는 항상 독립된 그룹으로 끊어서 렌더링한다.
const groupMessages = (messages: ChatMessage[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];
  messages.forEach((message) => {
    if (message.kind === "appointment") {
      groups.push({ kind: "appointment", message });
      return;
    }
    const lastGroup = groups[groups.length - 1];
    if (
      lastGroup &&
      lastGroup.kind === "text" &&
      lastGroup.sender === message.sender
    ) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        kind: "text",
        sender: message.sender,
        messages: [message],
      });
    }
  });
  return groups;
};

// TODO(1:1 매칭/채팅 백엔드 미구현): 말풍선 레이아웃 확인용 목업 대화.
// 실제 시각은 Figma 예시(오후 2:01~2:05)를 그대로 쓰되, 날짜만 대화방이 열린 당일로 맞춘다.
const createMockMessages = (roomCreatedAt: Date): TextMessage[] => {
  const at = (hour: number, minute: number) => {
    const date = new Date(roomCreatedAt);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  return [
    {
      id: "1",
      kind: "text",
      sender: "mate",
      text: "안녕하세요 수빈님\n부동산 메이트로 만나서 반가습니다.",
      sentAt: at(14, 1),
    },
    {
      id: "2",
      kind: "text",
      sender: "me",
      text: "안녕 킴 응우옌\n저도 반가워요~\n집은 언제쯤 이사하고 싶으세요?",
      sentAt: at(14, 3),
    },
    {
      id: "3",
      kind: "text",
      sender: "mate",
      text: "8월 10일까지 이사하고 싶어요",
      sentAt: at(14, 4),
    },
    {
      id: "4",
      kind: "text",
      sender: "mate",
      text: "예산은 1,000만원이에요",
      sentAt: at(14, 4),
    },
    {
      id: "5",
      kind: "text",
      sender: "me",
      text: "알려주셔서 감사해요!\n그럼 시간은 언제가 괜찮으세요?",
      sentAt: at(14, 5),
    },
  ];
};

/**
 * 부메랑 메이트와의 1:1 채팅방 (Figma node 1119:17326, "채팅방" - 대화 진행 중 상태).
 * 날짜 배지는 Figma 목업 날짜를 그대로 쓰지 않고, 대화방이 열린(=화면에 처음 마운트된) 당일 날짜로 표시한다.
 * 카카오톡처럼 같은 발신자가 같은 분(分)에 연달아 보낸 메시지는 마지막 메시지에만 시간을 표시한다.
 * TODO(채팅 백엔드 미구현): 메시지 전송/수신은 로컬 상태로만 동작하는 목업이다.
 */
export default function MateChatScreen() {
  const router = useRouter();
  const houseFoundAt = useMatchingApplicationStore((state) => state.houseFoundAt);
  const markHouseFound = useMatchingApplicationStore((state) => state.markHouseFound);
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const setLastMatch = useMatchingApplicationStore((state) => state.setLastMatch);
  const [isSubmittingRematch, setIsSubmittingRematch] = useState(false);
  const [roomCreatedAt] = useState(() => new Date());
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createMockMessages(roomCreatedAt),
  );
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
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        kind: "text",
        text,
        sender: "me",
        sentAt: new Date(),
      },
    ]);
    setDraft("");
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const openAttachMenu = () => {
    attachButtonRef.current?.measureInWindow((x, y) => {
      const windowHeight = Dimensions.get("window").height;
      setAttachMenuAnchor({ left: x - 7, bottom: windowHeight - y - 8 });
      setIsAttachMenuOpen(true);
    });
  };

  const appendImageMessage = (uri: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        kind: "image",
        uri,
        sender: "me",
        sentAt: new Date(),
      },
    ]);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
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
      appendImageMessage(result.assets[0].uri);
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
      appendImageMessage(result.assets[0].uri);
    }
  };

  const handleConfirmAppointment = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        kind: "appointment",
        date: appointmentDate,
        time: appointmentTime,
        location: appointmentLocation,
        sentAt: new Date(),
      },
    ]);
    appointmentSheet.close();
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const messageGroups = groupMessages(messages);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title={MATE_NAME}
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
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full items-center">
            <View className="items-center justify-center rounded-2xl bg-[#FAFAFD] px-2.5 py-1">
              <Text className="font-pretendard text-12 leading-4 text-gray-700">
                {formatRoomCreatedDate(roomCreatedAt)}
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
              if (group.kind === "appointment") {
                const { message } = group;
                return (
                  <View key={groupIndex} className="w-full items-end">
                    <View className="w-[280px] flex-row items-center gap-5 rounded-2xl bg-[#F2F7FC] px-4 py-3">
                      <View className="flex-1 gap-2">
                        <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-900">
                          약속을 만들었어요
                        </Text>
                        <View className="gap-0.5">
                          <View className="flex-row gap-2">
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              날짜:
                            </Text>
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              {formatAppointmentCardDate(message.date)}
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              시간:
                            </Text>
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              {formatAppointmentCardTime(message.time)}
                            </Text>
                          </View>
                          <View className="flex-row gap-2">
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              장소:
                            </Text>
                            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-600">
                              {message.location}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <MapPreview width={114} height={104} pinSize={24} />
                    </View>
                  </View>
                );
              }

              if (group.sender === "mate") {
                return (
                  <View
                    key={groupIndex}
                    className="w-full flex-row items-start gap-2"
                  >
                    <View className="h-8 w-8 rounded-full bg-[#E6E6EB]" />
                    <View className="flex-1 gap-1 pr-2">
                      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
                        {MATE_NAME}
                      </Text>
                      <View className="items-start gap-1.5">
                        {group.messages.map((message, messageIndex) => {
                          const nextMessage = group.messages[messageIndex + 1];
                          const showTime =
                            !nextMessage ||
                            getMinuteKey(nextMessage.sentAt) !==
                              getMinuteKey(message.sentAt);
                          return (
                            <View
                              key={message.id}
                              className="flex-row items-end gap-1"
                            >
                              {message.kind === "image" ? (
                                <Image
                                  source={{ uri: message.uri }}
                                  className="h-[180px] w-[180px] rounded-2xl"
                                  resizeMode="cover"
                                />
                              ) : (
                                <View className="max-w-[226px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-gray-50 px-3 py-2">
                                  <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                                    {message.text}
                                  </Text>
                                </View>
                              )}
                              {showTime && (
                                <Text className="font-pretendard text-12 leading-4 text-gray-600">
                                  {formatMessageTime(message.sentAt)}
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
                    const showTime =
                      !nextMessage ||
                      getMinuteKey(nextMessage.sentAt) !==
                        getMinuteKey(message.sentAt);
                    return (
                      <View
                        key={message.id}
                        className="flex-row items-end gap-1"
                      >
                        {showTime && (
                          <Text className="font-pretendard text-12 leading-4 text-gray-600">
                            {formatMessageTime(message.sentAt)}
                          </Text>
                        )}
                        {message.kind === "image" ? (
                          <Image
                            source={{ uri: message.uri }}
                            className="h-[180px] w-[180px] rounded-2xl"
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="max-w-[272px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl border border-gray-200 bg-white px-3 py-2">
                            <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                              {message.text}
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
                      {MATE_NAME}
                    </Text>
                    <Text className="font-pretendard text-12 leading-4 text-black">
                      {MOCK_MATE.school}
                    </Text>
                  </View>
                </View>

                <View className="w-full gap-2">
                  {MATE_INFO_ROWS.map((row) => (
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
