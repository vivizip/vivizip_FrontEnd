import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import { TOPBAR_EXTRA_TOP } from "../lib/layout";

type Props = {
  title: string;
  leftIcon?: ImageSourcePropType;
  onPressLeft?: () => void;
  rightIcon?: ImageSourcePropType;
  onPressRight?: () => void;
};

/**
 * TopBar 공통 컴포넌트 (Figma)
 * - 레이아웃: width full, padding 12px 16px(상하 대칭), items center, gap 8px
 *   (상단은 여기에 TOPBAR_EXTRA_TOP(12px)을 더해 총 24px - 상태바 바로 아래 붙는 느낌 보정)
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
    <View
      className="w-full flex-row items-center gap-2 px-4 pb-3"
      style={{ paddingTop: 12 + TOPBAR_EXTRA_TOP }}
    >
      {leftIcon && (
        <Pressable
          onPress={onPressLeft}
          hitSlop={12}
          accessibilityRole="button"
        >
          <Image source={leftIcon} className="h-6 w-6" resizeMode="contain" />
        </Pressable>
      )}
      <Text
        numberOfLines={1}
        className="flex-1 text-left font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900"
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
