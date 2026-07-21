import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import TopBar from "../../../../components/TopBar";
import ChatRoomListItem from "./ChatRoomListItem";
import { getChatRooms, type ChatRoom } from "../../services/chatApi";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { useToastStore } from "../../../../store/useToastStore";

const FALLBACK_LOAD_ERROR = "채팅 목록을 불러오지 못했어요.";
const FALLBACK_NAME = "대화 상대";

const formatTimeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
};

/**
 * 채팅 목록 탭 (Figma node 1119:17312, "채팅").
 * GET /api/chat/rooms는 상대 이름/프로필을 안 주므로, 현재 매칭(lastMatch)과
 * matchId가 같은 방만 이름을 표시하고 나머지는 일반 라벨로 보여준다.
 * 마지막 메시지 미리보기/최근 활동 시각도 API에 없어 방 생성 시각으로 대체한다.
 */
export default function ChatListScreen() {
  const router = useRouter();
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const role = useMatchingApplicationStore((state) => state.role);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useFocusEffect(
    useCallback(() => {
      getChatRooms()
        .then(setRooms)
        .catch((err) => {
          useToastStore
            .getState()
            .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
        });
    }, []),
  );

  const resolveName = (room: ChatRoom) => {
    if (!lastMatch || lastMatch.matchId !== room.matchId) return FALLBACK_NAME;
    return role === "supporter" ? lastMatch.studentName : lastMatch.supporterName;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar title="채팅" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {rooms.map((room, index) => (
          <View key={room.roomId}>
            <ChatRoomListItem
              name={resolveName(room)}
              timeAgo={formatTimeAgo(room.createdAt)}
              unreadCount={room.unreadCount}
              onPress={() =>
                router.push({
                  pathname: "/matching/chat",
                  params: { roomId: String(room.roomId) },
                })
              }
            />
            {index < rooms.length - 1 && (
              <View className="h-px w-full bg-gray-50" />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
