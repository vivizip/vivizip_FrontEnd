import React from "react";
import { Pressable, Text } from "react-native";

import ChipS from "../../../../components/ChipS";

type Props = {
  name: string;
  isLast?: boolean;
  /** 이 단계(계약전 등)가 등록된 집으로 인해 활성화됐는지 */
  isActive?: boolean;
  onPress?: () => void;
};

/**
 * 문서 한 줄 (문서명 + 발급하기 chip-s).
 * 활성화 시 chip 배경 primary-500, 텍스트 #F2F7FC로 변경 (Figma).
 */
export default function DocumentItem({
  name,
  isLast = false,
  isActive = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[52px] flex-row items-center justify-between px-4 active:opacity-70 ${
        isLast ? "" : "border-b border-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${name} 발급하기`}
    >
      {/* Figma: Label-m (Pretendard 14/500, lh 20), gray-400(활성 시 gray-900) */}
      <Text
        className={`font-pretendard text-14 font-medium leading-5 ${
          isActive ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {name}
      </Text>
      <ChipS
        label="발급하기"
        bgClassName={isActive ? "bg-primary-500" : undefined}
        textClassName={isActive ? "text-[#F2F7FC]" : undefined}
      />
    </Pressable>
  );
}
