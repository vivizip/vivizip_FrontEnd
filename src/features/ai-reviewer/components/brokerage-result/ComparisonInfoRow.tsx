import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  label: string;
  value: string;
};

/**
 * OCR 결과 비교 정보 행 (예: 소유자 일치 여부) (Figma)
 * - bg gray-10(#FAFAFD), radius 12px, padding 16px 8px
 */
export default function ComparisonInfoRow({ icon, label, value }: Props) {
  return (
    <View className="w-full flex-row items-center gap-2 rounded-xl bg-[#FAFAFD] px-4 py-2">
      <View className="flex-row items-center gap-2">
        <Image
          source={icon}
          className="h-6 w-6"
          resizeMode="contain"
          style={{ tintColor: "#2C74F2" }}
        />
        <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
          {label}
        </Text>
      </View>
      <View className="h-5 w-px bg-gray-200" />
      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
        {value}
      </Text>
    </View>
  );
}
