import React from "react";
import { Image, Pressable, Text } from "react-native";

const locationIcon = require("../../../../../assets/icons/ic_mylocation.png");

type Props = {
  onPress?: () => void;
};

/**
 * 현재 위치로 찾기 버튼 (Figma)
 * - 레이아웃: padding 8px 16px, 중앙 정렬, gap 8px, self stretch
 * - 스타일: radius 16px, border 1px gray-300, bg #FFF
 * - 아이콘: 24x24, gray-600 / 텍스트: Body/body-s (Pretendard 14/600, lh 22), gray-600
 */
export default function CurrentLocationButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-center gap-2 self-stretch rounded-2xl border border-gray-300 bg-white px-4 py-2 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel="현재 위치로 찾기"
    >
      <Image
        source={locationIcon}
        className="h-6 w-6"
        resizeMode="contain"
        style={{ tintColor: "#626975" }} // gray-600
      />
      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
        현재 위치로 찾기
      </Text>
    </Pressable>
  );
}
