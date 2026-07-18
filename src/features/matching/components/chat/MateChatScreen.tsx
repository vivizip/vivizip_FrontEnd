import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../../components/TopBar";

const backIcon = require("../../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../../assets/icons/ic_kebab.png");
const plusIcon = require("../../../../../assets/icons/ic_plus.png");
const calendarIcon = require("../../../../../assets/icons/lucide_calendar.png");
const homeIcon = require("../../../../../assets/icons/ic_home_default.png");
const sendIconOn = require("../../../../../assets/icons/ic_on_send.png");
const sendIconOff = require("../../../../../assets/icons/ic_off_send.png");

// TODO(1:1 매칭 미구현): 실제 매칭된 메이트 이름이 없어 목업으로 표시.
const MATE_NAME = "킴 응우옌";

type ChatMessage = {
  id: string;
  text: string;
  sender: "me" | "mate";
  sentAt: Date;
};

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

// 같은 "분"인지 비교하는 키 (초 단위는 무시)
const getMinuteKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;

// 연속된 같은 발신자 메시지를 하나의 그룹(아바타/이름 헤더 공유)으로 묶는다.
const groupMessagesBySender = (messages: ChatMessage[]) => {
  const groups: { sender: ChatMessage["sender"]; messages: ChatMessage[] }[] =
    [];
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

// TODO(1:1 매칭/채팅 백엔드 미구현): 말풍선 레이아웃 확인용 목업 대화.
// 실제 시각은 Figma 예시(오후 2:01~2:05)를 그대로 쓰되, 날짜만 대화방이 열린 당일로 맞춘다.
const createMockMessages = (roomCreatedAt: Date): ChatMessage[] => {
  const at = (hour: number, minute: number) => {
    const date = new Date(roomCreatedAt);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  return [
    {
      id: "1",
      sender: "mate",
      text: "안녕하세요 수빈님\n부동산 메이트로 만나서 반가습니다.",
      sentAt: at(14, 1),
    },
    {
      id: "2",
      sender: "me",
      text: "안녕 킴 응우옌\n저도 반가워요~\n집은 언제쯤 이사하고 싶으세요?",
      sentAt: at(14, 3),
    },
    {
      id: "3",
      sender: "mate",
      text: "8월 10일까지 이사하고 싶어요",
      sentAt: at(14, 4),
    },
    {
      id: "4",
      sender: "mate",
      text: "예산은 1,000만원이에요",
      sentAt: at(14, 4),
    },
    {
      id: "5",
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
  const [roomCreatedAt] = useState(() => new Date());
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    createMockMessages(roomCreatedAt),
  );
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, text, sender: "me", sentAt: new Date() },
    ]);
    setDraft("");
  };

  const messageGroups = groupMessagesBySender(messages);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title={MATE_NAME}
        leftIcon={backIcon}
        onPressLeft={() => router.replace("/chat")}
        rightIcon={kebabIcon}
        // TODO(케밥 메뉴 미구현): 메뉴 항목/디자인이 아직 없어 아이콘만 표시
        onPressRight={() => {}}
      />

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
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
                              <View className="max-w-[226px] rounded-tr-2xl rounded-br-2xl rounded-bl-2xl bg-gray-50 px-3 py-2">
                                <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                                  {message.text}
                                </Text>
                              </View>
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
                        <View className="max-w-[272px] rounded-tl-2xl rounded-bl-2xl rounded-br-2xl border border-gray-200 bg-white px-3 py-2">
                          <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-700">
                            {message.text}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })
          )}
        </ScrollView>

        <View className="w-full gap-1 bg-white">
          <View className="w-full flex-row gap-2 px-4">
            {/* TODO(약속 잡기 미구현): 실제 일정 조율 기능 없이 칩만 표시 */}
            <Pressable
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
            {/* TODO(집 구하기 완료 처리 미구현): 부메랑 진행과정 상태 연동 없이 칩만 표시 */}
            <Pressable
              className="h-8 flex-row items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="집 구하기 완료"
            >
              <Image
                source={homeIcon}
                className="h-4 w-4"
                resizeMode="contain"
              />
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                집 구하기 완료
              </Text>
            </Pressable>
          </View>

          <View className="w-full flex-row items-end px-4 pb-2 pt-2.5">
            <View className="w-full flex-row items-end gap-2 rounded-3xl bg-gray-50 p-2">
              {/* TODO(첨부 미구현): 사진/파일 첨부 기능 없이 버튼만 표시 */}
              <Pressable
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
              <TextInput
                value={draft}
                onChangeText={setDraft}
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
    </SafeAreaView>
  );
}
