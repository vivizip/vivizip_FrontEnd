import React from "react";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active: boolean;
  onPress?: () => void;
  /** 버튼 넓이 tailwind 클래스 (기본 w-full) */
  widthClassName?: string;
  /** 버튼 높이 tailwind 클래스 (기본 h-11/44px) */
  heightClassName?: string;
  /** 버튼 모서리 radius tailwind 클래스 (기본 rounded-2xl/16px) */
  radiusClassName?: string;
  /** 버튼 padding tailwind 클래스 (기본 px-4) */
  paddingClassName?: string;
  /** 폰트 size tailwind 클래스 (기본 16px) */
  fontsizeClassName?: string;
};

/**
 * CTAButton 공통 컴포넌트 (Figma)
 * - active: bg primary-500, 텍스트 흰색
 * - non-active: bg gray-100, 텍스트 gray-400, 비활성(터치 불가)
 * - 기본 레이아웃: height 44px, radius 16px, padding 좌우 16px
 * - 텍스트: Title/Title-s (Pretendard 16/600, lh 24, ls -0.16), 중앙 정렬, 한 줄 말줄임
 * - 다른 크기/radius/padding이 필요하면 heightClassName/radiusClassName/paddingClassName로 override
 */
export default function CTAButton({
  label,
  active,
  onPress,
  widthClassName = "w-full",
  heightClassName = "h-11",
  radiusClassName = "rounded-2xl",
  paddingClassName = "px-4",
  fontsizeClassName = "text-16",
}: Props) {
  return (
    <Pressable
      onPress={active ? onPress : undefined}
      disabled={!active}
      className={`${widthClassName} items-center justify-center font-semibold ${heightClassName} ${radiusClassName} ${paddingClassName} ${
        active ? "bg-primary-500 active:opacity-80" : "bg-gray-100"
      }`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !active }}
      accessibilityLabel={label}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className={`text-center font-pretendard-semibold ${fontsizeClassName} font-semibold leading-6 tracking-[-0.16px] ${
          active ? "text-white" : "text-gray-400"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
