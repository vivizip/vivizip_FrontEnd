import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
};

/**
 * chip-s 공통 컴포넌트 (Figma)
 * - 레이아웃: padding 2px 12px, 중앙 정렬, gap 4px
 * - 텍스트: Body/body-s (Pretendard 14/600, lh 22), gray-400
 */
export default function ChipS({ label }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-1 px-3 py-0.5">
      <Text className="font-pretendard text-14 font-semibold leading-[22px] text-gray-400">
        {label}
      </Text>
    </View>
  );
}
