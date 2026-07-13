import React from "react";
import { View } from "react-native";

/**
 * 히어로 카드 아래 페이지 인디케이터 (스크린샷 기반 근사치)
 */
export default function PageDots() {
  return (
    <View className="w-full items-center gap-1">
      <View className="h-[10px] w-[10px] rounded-full bg-gray-900" />
      <View className="h-2 w-2 rounded-full bg-gray-600" />
      <View className="h-[6px] w-[6px] rounded-full bg-gray-200" />
    </View>
  );
}
