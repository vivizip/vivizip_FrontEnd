import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  title: string;
  description: string;
};

/**
 * 위험 요소 카드 (Figma)
 * - 헤더: bg secondary-50(핑크), 상단만 radius 12px, gap 8px, padding 12px, 경고아이콘 24x24 + 제목(Title-m) secondary-500
 * - 본문: padding 12px 10px, 설명 텍스트(14 Medium lh20) gray-500
 */
export default function RiskCard({ icon, title, description }: Props) {
  return (
    <View className="w-full flex-col items-start">
      <View className="w-full flex-row items-center gap-2 rounded-t-xl bg-secondary-50 p-3">
        <Image source={icon} className="h-6 w-6" resizeMode="contain" />
        <Text className="text-title-m text-secondary-500">{title}</Text>
      </View>
      <View className="w-full items-center justify-center px-3 py-2.5">
        <Text className="w-full font-pretendard text-14 font-medium leading-5 text-gray-500">
          {description}
        </Text>
      </View>
    </View>
  );
}
