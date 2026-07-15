import React from "react";
import { Text, View } from "react-native";

type Props = {
  items: string[];
};

/**
 * 아티클 본문 공통 불릿 리스트
 */
export default function ArticleBulletList({ items }: Props) {
  return (
    <View className="w-full gap-0.5">
      {items.map((item) => (
        <View key={item} className="w-full flex-row gap-1">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
            •
          </Text>
          <Text className="flex-1 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
