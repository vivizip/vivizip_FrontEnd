import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
  /** 배경색 tailwind 클래스 (기본 bg-primary-50) */
  bgClassName?: string;
  /** 텍스트 색 tailwind 클래스 (기본 text-primary-500) */
  textClassName?: string;
};

/**
 * badge 공통 컴포넌트 (Figma)
 * - 레이아웃: height 24px, padding 4px 10px, 중앙 정렬, gap 10px
 * - 스타일: radius 16px, bg primary-50(#EEF6FF)
 * - 텍스트: Label/Label-s (Pretendard 12/600, lh 18), primary-500(#2C74F2)
 * - 어두운 숫자 배지(01/02/03) 등 다른 톤이 필요하면 bgClassName/textClassName로 override
 */
export default function Badge({ label, bgClassName, textClassName }: Props) {
  return (
    <View
      className={`h-6 flex-row items-center justify-center gap-2.5 self-start rounded-2xl px-2.5 ${
        bgClassName ?? "bg-primary-50"
      }`}
    >
      <Text
        className={`font-pretendard-semibold text-12 font-semibold leading-[18px] ${
          textClassName ?? "text-primary-500"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}
