import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  /** 배경색 tailwind 클래스 (기본 투명) */
  bgClassName?: string;
  /** 텍스트 색 tailwind 클래스 (기본 text-gray-400) */
  textClassName?: string;
};

/**
 * chip-s 공통 컴포넌트 (Figma)
 * - 레이아웃: padding 2px 12px, 중앙 정렬, gap 4px
 * - 텍스트: Body/body-s (Pretendard 14/600, lh 22), 기본 gray-400
 */
export default function ChipS({ label, bgClassName, textClassName }: Props) {
  return (
    <View
      className={`flex-row items-center justify-center gap-1 rounded-[100px] px-3 py-0.5 ${
        bgClassName ?? ""
      }`}
    >
      <Text
        className={`font-pretendard-semibold text-14 font-semibold leading-[22px] ${
          textClassName ?? "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
