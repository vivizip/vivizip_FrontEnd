import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

type Props = {
  label: string;
  /** 텍스트 오른쪽에 표시할 16x16 아이콘 (assets require) */
  icon?: ImageSourcePropType;
  /** 아이콘 색상 (지정 안 하면 원본 색 그대로) */
  iconTintColor?: string;
  /** 아이콘을 누를 수 있게 하려면 전달 (예: 최근 검색어 삭제) */
  onIconPress?: () => void;
  /** 칩 전체를 누를 수 있게 하려면 전달 (예: 최근 검색어로 재검색) */
  onPress?: () => void;
  /** 텍스트 색 tailwind 클래스 (기본 text-gray-800) */
  textClassName?: string;
  /** 배경색 tailwind 클래스 (기본 bg-gray-100) */
  bgClassName?: string;
};

/**
 * chip-m 공통 컴포넌트 (Figma)
 * - 레이아웃: height 28px, padding 2px 8px 2px 12px, 중앙 정렬, gap 4px
 * - 스타일: radius 100px, bg gray-100(#E7E9EC)
 * - 텍스트: Body/body-s (Pretendard 14/600, lh 22), 기본 gray-800
 * - 아이콘: 16x16, 텍스트와 4px 간격
 */
export default function ChipM({
  label,
  icon,
  iconTintColor,
  onIconPress,
  onPress,
  textClassName,
  bgClassName,
}: Props) {
  const className = `h-7 flex-row items-center justify-center gap-1 self-start rounded-[100px] ${
    icon ? "pl-3 pr-2" : "px-3"
  } ${bgClassName ?? "bg-gray-100"}`;

  const content = (
    <>
      <Text
        className={`font-pretendard-semibold text-14 font-semibold leading-[22px] ${
          textClassName ?? "text-gray-800"
        }`}
      >
        {label}
      </Text>
      {icon && (
        <Pressable
          onPress={onIconPress}
          disabled={!onIconPress}
          hitSlop={8}
          accessibilityRole={onIconPress ? "button" : undefined}
        >
          <Image
            source={icon}
            className="h-4 w-4"
            resizeMode="contain"
            style={iconTintColor ? { tintColor: iconTintColor } : undefined}
          />
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={`${className} active:opacity-70`}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {content}
      </Pressable>
    );
  }

  return <View className={className}>{content}</View>;
}
