import React from "react";
import { Text, View } from "react-native";

type Props = {
  label: string;
};

/**
 * badge 공통 컴포넌트 (Figma)
 * - 레이아웃: height 24px, padding 4px 10px, 중앙 정렬, gap 10px
 * - 스타일: radius 16px, bg primary-50(#EEF6FF)
 * - 텍스트: Label/Label-s (Pretendard 12/600, lh 18), primary-500(#2C74F2)
 */
export default function Badge({ label }: Props) {
  return (
    <View className="h-6 flex-row items-center justify-center gap-2.5 self-start rounded-2xl bg-primary-50 px-2.5">
      <Text className="font-pretendard text-12 font-semibold leading-[18px] text-primary-500">
        {label}
      </Text>
    </View>
  );
}
