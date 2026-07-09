import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

type Props = {
  title: string;
  leftIcon?: ImageSourcePropType;
  onPressLeft?: () => void;
  rightIcon?: ImageSourcePropType;
  onPressRight?: () => void;
};

/**
 * TopBar 공통 컴포넌트 (Figma)
 * - 레이아웃: width full, padding 12px 16px, items center, gap 8px
 * - 좌측 아이콘(24x24) - 타이틀(가운데 남은 공간, 좌측 정렬) - 우측 아이콘(24x24)
 * - 타이틀: Title/Title-m (Pretendard 18/600, lh 26), gray-900
 */
export default function TopBar({
  title,
  leftIcon,
  onPressLeft,
  rightIcon,
  onPressRight,
}: Props) {
  return (
    <View className="w-full flex-row items-center gap-2 px-4 py-3">
      {leftIcon && (
        <Pressable onPress={onPressLeft} accessibilityRole="button">
          <Image source={leftIcon} className="h-6 w-6" resizeMode="contain" />
        </Pressable>
      )}
      <Text
        numberOfLines={1}
        className="flex-1 text-left font-pretendard text-18 font-semibold leading-[26px] text-gray-900"
      >
        {title}
      </Text>
      {rightIcon && (
        <Pressable onPress={onPressRight} accessibilityRole="button">
          <Image
            source={rightIcon}
            className="h-6 w-6"
            resizeMode="contain"
          />
        </Pressable>
      )}
    </View>
  );
}
