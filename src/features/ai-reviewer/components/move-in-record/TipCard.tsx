import React from "react";
import { Pressable, Text, View } from "react-native";

import Badge from "../../../../components/Badge";

type Props = {
  title: string;
  date: string;
  onPress?: () => void;
};

/**
 * 입주민 추천 콘텐츠 카드 (Figma) - "입주 팁" 배지 + 제목 + 날짜
 * - bg gray-10(#FAFAFD), radius 16px, padding 16px 12px
 */
export default function TipCard({ title, date, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full gap-2.5 rounded-2xl bg-[#FAFAFD] px-4 py-3 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View className="w-full gap-1">
        <View>
          <Badge label="입주 팁" bgClassName="bg-primary-100" />
        </View>
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-800">
          {title}
        </Text>
      </View>
      <Text className="w-full text-left font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-400">
        {date}
      </Text>
    </Pressable>
  );
}
