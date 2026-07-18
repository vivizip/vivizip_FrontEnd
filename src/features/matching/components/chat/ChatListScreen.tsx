import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../../components/TopBar";
import ChatRoomListItem from "./ChatRoomListItem";

// TODO(채팅 백엔드 미구현): 실제 대화방 목록이 없어 목업으로 표시.
// "킴 응우옌"만 실제로 만들어진 채팅방(/matching/chat)과 연결되고, 나머지는
// 목록 디자인 확인용 정적 목업이라 탭해도 반응하지 않는다.
const MOCK_ROOMS = [
  {
    id: "kim",
    name: "킴 응우옌",
    lastMessage: "안녕하세여 김응우옌씨\n랜덤비빔밥 같이 드쉴래요~?",
    timeAgo: "5분 전",
    unreadCount: 1,
    navigable: true,
  },
  {
    id: "maria",
    name: "널위한마리아",
    lastMessage: "집은 어느 지역으로 구하고 싶으세요?",
    timeAgo: "20분 전",
    unreadCount: 12,
    navigable: false,
  },
  {
    id: "tom",
    name: "톰 홀랭이",
    lastMessage: "안녕 박지민씨!\n다음주 금요일 어떠세요?",
    timeAgo: "2일 전",
    unreadCount: 24,
    navigable: false,
  },
  {
    id: "zen",
    name: "젠다이아몬드",
    lastMessage: "안녕하세요 최민재님!\n커피 한 잔 하실래요?",
    timeAgo: "7일 전",
    unreadCount: 0,
    navigable: false,
  },
  {
    id: "max",
    name: "막스 베르스타펜",
    lastMessage: "안녕 홍길동씨!\n다음 주에 저녁 같이 먹을까요?",
    timeAgo: "30일 전",
    unreadCount: 0,
    navigable: false,
  },
] as const;

/**
 * 채팅 목록 탭 (Figma node 1119:17312, "채팅").
 * MateChatScreen(채팅방)의 뒤로가기를 누르면 이 화면으로 돌아온다.
 */
export default function ChatListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar title="채팅" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_ROOMS.map((room, index) => (
          <View key={room.id}>
            <ChatRoomListItem
              name={room.name}
              lastMessage={room.lastMessage}
              timeAgo={room.timeAgo}
              unreadCount={room.unreadCount}
              onPress={() => {
                if (room.navigable) {
                  router.push("/matching/chat");
                }
              }}
            />
            {index < MOCK_ROOMS.length - 1 && (
              <View className="h-px w-full bg-gray-50" />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
