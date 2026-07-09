import React from "react";
import { Pressable, Text } from "react-native";

import ChipS from "../../../../components/ChipS";

type Props = {
  name: string;
  isLast?: boolean;
};

/**
 * 문서 한 줄 (문서명 + 발급하기 chip-s).
 * 발급하기 액션은 추후 연결.
 */
export default function DocumentItem({ name, isLast = false }: Props) {
  return (
    <Pressable
      className={`h-[52px] flex-row items-center justify-between px-4 active:opacity-70 ${
        isLast ? "" : "border-b border-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${name} 발급하기`}
    >
      {/* Figma: Label-m (Pretendard 14/500, lh 20), gray-400 */}
      <Text className="font-pretendard text-14 font-medium leading-5 text-gray-400">
        {name}
      </Text>
      <ChipS label="발급하기" />
    </Pressable>
  );
}
