import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  name: string;
  lastMessage: string;
  timeAgo: string;
  unreadCount?: number;
  onPress: () => void;
};

/**
 * 채팅 목록의 대화방 한 줄 (Figma node 1119:17315 등, "채팅 목록").
 * 프로필은 실제 이미지가 없어 회색 원(#E6E6EB)으로 표시하고, 안 읽은 메시지가
 * 있을 때만(unreadCount > 0) 우측 하단에 파란 숫자 배지를 보여준다.
 */
export default function ChatRoomListItem({
  name,
  lastMessage,
  timeAgo,
  unreadCount,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center justify-between gap-2 py-2 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View className="flex-1 flex-row items-center gap-2.5">
        <View className="h-[52px] w-[52px] rounded-full bg-[#E6E6EB]" />
        <View className="flex-1 gap-0.5">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-black">
            {name}
          </Text>
          <Text
            numberOfLines={2}
            className="font-pretendard text-12 leading-4 text-gray-500"
          >
            {lastMessage}
          </Text>
        </View>
      </View>

      <View className="items-end gap-2">
        <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-500">
          {timeAgo}
        </Text>
        {!!unreadCount && unreadCount > 0 && (
          <View className="h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1.5">
            <Text className="font-pretendard text-12 leading-4 text-[#F2F7FC]">
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}
