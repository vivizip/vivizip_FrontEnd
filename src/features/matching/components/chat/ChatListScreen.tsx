import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import TopBar from "../../../../components/TopBar";
import ChipM from "../../../../components/ChipM";
import ChatRoomListItem from "./ChatRoomListItem";
import { getChatRooms, type ChatRoom } from "../../services/chatApi";
import { getMatchResult, getMatchStatus } from "../../services/matchApi";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { useAuthUserStore } from "../../../auth/store/useAuthUserStore";
import { useToastStore } from "../../../../store/useToastStore";

const rightIcon = require("../../../../../assets/icons/ic_right.png");

const FALLBACK_LOAD_ERROR = "채팅 목록을 불러오지 못했어요.";
const FALLBACK_NAME = "대화 상대";

const formatTimeAgo = (iso: string): string => {
  const timestamp = new Date(iso).getTime();
  if (!Number.isFinite(timestamp)) return "-";
  const diffMs = Math.max(0, Date.now() - timestamp);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}일 전`;
};

/**
 * 채팅 목록 탭.
 * 매칭(MATCHED)되기 전까지는 채팅을 쓸 수 없어서, 매칭 전(신청 전/신청 후 대기 중
 * 모두 포함) 상태면 빈 채팅 안내 화면(Figma node 2884:24399)을 보여준다.
 * "부메랑 신청하기" 버튼은 BoomerangBannerCard의 매칭 전 상태 버튼과 동일한
 * 스타일·플로우(router.push("/matching/intro"))를 그대로 쓴다.
 * matchStatus는 BoomerangBannerCard와 마찬가지로 이 탭이 포커스될 때마다 새로고침한다
 * (여기 먼저 들어오면 홈에서 아직 안 받아온 값일 수 있어서).
 * GET /api/chat/rooms는 상대 이름/프로필을 안 주므로, 현재 매칭(lastMatch)과
 * matchId가 같은 방만 이름을 표시하고 나머지는 일반 라벨로 보여준다.
 * 마지막 메시지 미리보기/최근 활동 시각은 목록 API 응답값을 사용한다.
 */
export default function ChatListScreen() {
  const router = useRouter();
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const matchStatus = useMatchingApplicationStore((state) => state.matchStatus);
  const setMatchStatus = useMatchingApplicationStore(
    (state) => state.setMatchStatus,
  );
  const setLastMatch = useMatchingApplicationStore((state) => state.setLastMatch);
  const myUserId = useAuthUserStore((state) => state.user?.id) ?? null;
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMatchStatus()
        .then(async (status) => {
          setMatchStatus(status);
          if (status === "MATCHED") {
            const [data, match] = await Promise.all([
              getChatRooms(),
              getMatchResult(),
            ]);
            setLastMatch(match);
            setRooms(data);
          }
        })
        .catch((err) => {
          useToastStore
            .getState()
            .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
        });
    }, [setLastMatch, setMatchStatus]),
  );

  const resolveName = (room: ChatRoom) => {
    if (myUserId == null) return FALLBACK_NAME;
    if (Number(myUserId) === Number(room.studentId)) {
      return lastMatch?.matchId === room.matchId
        ? lastMatch.supporterName
        : FALLBACK_NAME;
    }
    if (Number(myUserId) === Number(room.supporterId)) {
      return lastMatch?.matchId === room.matchId
        ? lastMatch.studentName
        : FALLBACK_NAME;
    }
    return FALLBACK_NAME;
  };

  if (matchStatus !== "MATCHED") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <TopBar title="채팅" />
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-full items-center gap-3 pb-24">
            <Text className="w-full text-center font-pretendard-medium text-16 font-medium leading-6 text-gray-700">
              부메랑 메이트 신청 후 채팅이 가능해요
            </Text>
            <Pressable
              onPress={() => router.push("/matching/intro")}
              accessibilityRole="button"
              accessibilityLabel="부메랑 신청하기"
              className="active:opacity-70"
            >
              <ChipM
                label="부메랑 신청하기"
                icon={rightIcon}
                bgClassName="bg-[#F2F7FC] border border-gray-100"
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              lastMessage={room.lastMessage ?? undefined}
              timeAgo={formatTimeAgo(room.lastMessageAt ?? room.createdAt)}
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
