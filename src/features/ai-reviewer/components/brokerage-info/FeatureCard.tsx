import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  image: ImageSourcePropType;
  text: string;
};

/**
 * 섹션1(불법 건축물 여부)의 아이콘 + 2줄 설명 카드
 */
export default function FeatureCard({ image, text }: Props) {
  return (
    <View
      className="h-[150px] w-[156px] justify-center gap-2 rounded-2xl bg-[#F2F7FC] px-4 py-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 0.5,
      }}
    >
      <Image source={image} className="h-14 w-14" resizeMode="contain" />
      <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-800">
        {text}
      </Text>
    </View>
  );
}
