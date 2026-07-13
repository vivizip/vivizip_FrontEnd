import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  leftIcon: ImageSourcePropType;
  leftLabel: string;
  rightIcon: ImageSourcePropType;
  rightLabel: string;
  centerLabel: string;
};

/**
 * 섹션2(계약자/근저당권 일치 여부)의 문서 비교 다이어그램
 * - 가운데 원("AI분석")은 Android elevation이 사방으로 균일하게 안 퍼져서 border로 글로우 근사
 */
export default function DiagramCard({
  leftIcon,
  leftLabel,
  rightIcon,
  rightLabel,
  centerLabel,
}: Props) {
  return (
    <View
      className="w-full flex-row items-center justify-center gap-1 rounded-2xl bg-white px-4 py-3"
      style={{
        shadowColor: "#121619",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 0.2,
      }}
    >
      <View className="items-center gap-[5px]">
        <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-50">
          <Image source={leftIcon} className="h-9 w-7" resizeMode="contain" />
        </View>
        <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-800">
          {leftLabel}
        </Text>
      </View>
      <View className="h-px w-6 bg-gray-200" />
      <View
        className="h-[76px] w-[76px] items-center justify-center rounded-full bg-[#F2F7FC]"
        style={{
          shadowColor: "#2C74F2",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          borderWidth: 1,
          borderColor: "rgba(44, 116, 242, 0.35)",
        }}
      >
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 text-gray-800">
          {centerLabel}
        </Text>
      </View>
      <View className="h-px w-6 bg-gray-200" />
      <View className="items-center gap-[5px]">
        <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-primary-50">
          <Image source={rightIcon} className="h-9 w-7" resizeMode="contain" />
        </View>
        <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-800">
          {rightLabel}
        </Text>
      </View>
    </View>
  );
}
