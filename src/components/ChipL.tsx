import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
};

/**
 * chip-l 공통 컴포넌트 (Figma)
 * - 레이아웃: padding 6px 12px, 중앙 정렬, gap 4px
 * - 스타일: radius 500px, bg gray-100(#E7E9EC)
 * - 텍스트: Label/Label-m (Pretendard 14/500, lh 20), gray-800, 중앙 정렬
 */
export default function ChipL({ label }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-1 self-start rounded-[500px] bg-gray-100 px-3 py-1.5">
      <Text className="text-center font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
        {label}
      </Text>
    </View>
  );
}
