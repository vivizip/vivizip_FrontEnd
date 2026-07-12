import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  text: string;
};

/**
 * 등기부등본 확인 화면의 안내 배너 (Figma)
 * - bg #F2F7FC, padding 12px, radius 8px, gap 8px, 아이콘 24x24
 * - 텍스트: Body-s 프리셋이 weight 400이라 스펙(600)과 달라 직접 지정, primary-500
 */
export default function InfoBanner({ icon, text }: Props) {
  return (
    <View className="w-full flex-row items-start gap-2 rounded-lg bg-[#F2F7FC] p-3">
      <Image source={icon} className="h-6 w-6" resizeMode="contain" />
      <Text className="flex-1 font-pretendard text-14 font-semibold leading-[22px] text-primary-500">
        {text}
      </Text>
    </View>
  );
}
