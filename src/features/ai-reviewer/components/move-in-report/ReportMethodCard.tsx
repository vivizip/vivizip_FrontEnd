import React from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
};

/**
 * "방문 신고" / "온라인 신고" 카드 (Figma node 1588:20890, 1588:20913)
 * - 상단: 제목(primary-500) + 부제목, 하단: bg #FAFAFD 안에 ReportInfoRow 목록
 * - Figma의 omnidirectional drop-shadow는 Android elevation 한계로 얇은 border로 근사
 */
export default function ReportMethodCard({ title, subtitle, children }: Props) {
  return (
    <View className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white">
      <View className="w-full gap-1 px-4 py-3">
        <Text className="text-title-m text-primary-500">{title}</Text>
        <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
          {subtitle}
        </Text>
      </View>
      <View className="w-full gap-3 rounded-2xl bg-[#FAFAFD] px-4 py-3">
        {children}
      </View>
    </View>
  );
}
