import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import BoomerangIcon from "../../../../assets/icons/ic_boomerang.svg";

const documentIcon = require("../../../../assets/icons/ic_document_default.png");

export type NotificationKind = "article" | "matching";

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  date: string;
  isRead: boolean;
};

type Props = {
  notification: NotificationItem;
  onPress: (id: string) => void;
};

/**
 * 알림 목록 행 (Figma node 1666:48973/48974/48975, "alarm").
 * 읽지 않은 알림은 bg-[#F2F7FC] 하이라이트, 읽은 알림은 흰 배경.
 * kind별 아이콘: article -> ic_document_default(문서), matching -> ic_boomerang.
 */
export default function NotificationListItem({ notification, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress(notification.id)}
      className={`w-full flex-row items-start gap-2 p-4 active:opacity-70 ${
        notification.isRead ? "bg-white" : "bg-[#F2F7FC]"
      }`}
      accessibilityRole="button"
      accessibilityLabel={notification.title}
    >
      <View className="h-4 w-4 items-center justify-center">
        {notification.kind === "matching" ? (
          <BoomerangIcon width={16} height={16} />
        ) : (
          <Image
            source={documentIcon}
            className="h-4 w-4"
            resizeMode="contain"
          />
        )}
      </View>
      <View className="flex-1 gap-2">
        <View className="gap-1">
          <Text className="font-pretendard-semibold text-16 font-semibold leading-5 text-black">
            {notification.title}
          </Text>
          <Text className="font-pretendard-medium text-14 font-medium leading-5 text-[rgba(0,0,0,0.6)]">
            {notification.detail}
          </Text>
        </View>
        <Text className="font-pretendard-medium text-12 leading-4 text-[rgba(0,0,0,0.3)]">
          {notification.date}
        </Text>
      </View>
    </Pressable>
  );
}
