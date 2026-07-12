import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  title: string;
  items: string[];
};

/**
 * "계약 전 확인해보세요" 체크리스트 카드 (Figma)
 * - bg #FAFAFD, radius 16px, padding 16px 24px, gap 12px, shadow 0 0 4px rgba(0,0,0,0.1)
 * - 제목(Title-m) gray-900 + 구분선(gray-200) + 체크 항목(gap 6px, 각 행 gap 8px, Label-s gray-600)
 */
export default function ChecklistCard({ icon, title, items }: Props) {
  return (
    <View
      className="w-full flex-col items-start gap-3 rounded-2xl bg-[#FAFAFD] px-4 py-6"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Text className="text-title-m text-gray-900">{title}</Text>
      <View className="h-px w-full bg-gray-200" />
      <View className="w-full flex-col items-start gap-1.5">
        {items.map((item, index) => (
          <View key={index} className="w-full flex-row items-center gap-2">
            <Image source={icon} className="h-4 w-4" resizeMode="contain" />
            <Text className="flex-1 text-label-s text-gray-600">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
