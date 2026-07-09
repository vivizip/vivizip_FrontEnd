import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress?: () => void;
};

/**
 * CTAButton 공통 컴포넌트 (Figma)
 * - active: bg primary-500, 텍스트 흰색
 * - non-active: bg gray-100, 텍스트 gray-400, 비활성(터치 불가)
 * - height: 44px, radius: 16px
 * - 텍스트: Title/Title-s (Pretendard 16/600, lh 24, ls -0.16), 중앙 정렬, 한 줄 말줄임
 */
export default function CTAButton({ label, active, onPress }: Props) {
  return (
    <Pressable
      onPress={active ? onPress : undefined}
      disabled={!active}
      className={`h-11 w-full items-center justify-center rounded-2xl px-4 ${
        active ? "bg-primary-500 active:opacity-80" : "bg-gray-100"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !active }}
      accessibilityLabel={label}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className={`text-center font-pretendard text-16 font-semibold leading-6 tracking-[-0.16px] ${
          active ? "text-white" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
