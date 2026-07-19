import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import NotificationListItem, {
  type NotificationItem,
} from "./NotificationListItem";

const backIcon = require("../../../../assets/icons/ic_left.png");

// TODO(알림 백엔드 미구현): 실제 알림 목록/읽음 처리 API가 없어 목업 데이터로 로컬 상태만 관리한다.
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    kind: "article",
    title: "새로운 아티클이 업로드되었어요",
    detail:
      "비자 변경 날짜가 다가오지 않으셨나요? '확정날짜 받는 방법'을 알아보세요",
    date: "2026년 7월 3일",
    isRead: false,
  },
  {
    id: "2",
    kind: "matching",
    title: "부메랑 서포터즈 매칭이 완료되었어요",
    detail:
      "부동산 메이트 '부메랑' 서포터즈 매칭 결과가 발표되었어요. 누구랑 매칭됐을지 확인해보세요.",
    date: "2026년 7월 14일",
    isRead: false,
  },
  {
    id: "3",
    kind: "article",
    title: "새로운 아티클이 업로드되었어요",
    detail:
      "비자 변경 날짜가 다가오지 않으셨나요? '확정날짜 받는 방법'을 알아보세요",
    date: "2026년 7월 3일",
    isRead: true,
  },
];

/**
 * 알림 목록 화면 (Figma node 1666:48948, "알림"). 홈 헤더 알림 아이콘에서 진입한다.
 * Figma 원본은 "읽지 않은 알림 2개"라고 써있는데 실제로 하이라이트된 행은 1개뿐이라
 * (다른 화면들에서도 반복된 Figma 목업 불일치) - 여기서는 라벨과 실제 하이라이트 개수가
 * 항상 일치하도록 목업 데이터의 isRead를 2개 false로 맞췄다.
 */
export default function NotificationListScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handlePressItem = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="알림"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />

      <View className="w-full flex-row items-center justify-between border-b border-[#EDECEF] px-5 py-2">
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 text-gray-700">
          읽지 않은 알림 {unreadCount}개
        </Text>
        {unreadCount > 0 && (
          <Pressable
            onPress={handleMarkAllRead}
            className="p-1"
            accessibilityRole="button"
            accessibilityLabel="모두 읽음"
          >
            <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-primary-500">
              모두 읽음
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onPress={handlePressItem}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
