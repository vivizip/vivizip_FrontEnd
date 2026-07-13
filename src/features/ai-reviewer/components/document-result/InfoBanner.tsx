import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  text: string;
  variant?: "positive" | "negative";
};

/**
 * 등기부등본 확인 화면의 안내 배너 (Figma)
 * - bg #F2F7FC, padding 12px, radius 8px, gap 8px, 아이콘 24x24
 * - 텍스트: Body-s 프리셋이 weight 400이라 스펙(600)과 달라 직접 지정, primary-500
 */
export default function InfoBanner({ icon, text, variant = "positive" }: Props) {
  const isNegative = variant === "negative";

  return (
    <View
      className={`w-full flex-row items-start gap-2 rounded-lg p-3 ${
        isNegative ? "bg-[#FBF7F7]" : "bg-[#F2F7FC]"
      }`}
    >
      <Image
        source={icon}
        className="h-6 w-6"
        resizeMode="contain"
        style={{
          width: 24,
          height: 24,
          tintColor: isNegative ? "#CB3D50" : "#2C74F2",
        }}
      />
      <Text
        className={`flex-1 font-pretendard text-14 font-semibold leading-[22px] ${
          isNegative ? "text-secondary-500" : "text-primary-500"
        }`}
      >
        {text}
      </Text>
    </View>
  );
}
