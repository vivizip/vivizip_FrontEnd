import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  label: string;
  lines: string[];
  /** fixed: 소유권/등기날짜(h-[46px] w-[162px]) / full: 주소(w-full) */
  size?: "fixed" | "full";
};

/**
 * 등기부등본 확인 화면의 정보 행 (Figma)
 * - 아이콘 22x22 래퍼(실아이콘 16x16) + gap 8px + 라벨/값 컬럼(gap 4px)
 * - 라벨: Body-s 프리셋이 weight 400이라 스펙(600)과 달라 직접 지정, gray-500
 * - 값: Label/Label-m(14/500, lh20) gray-900, 여러 줄이면 줄 사이 gap 12px
 */
export default function InfoRow({ icon, label, lines, size = "fixed" }: Props) {
  return (
    <View
      className={`flex-row items-start gap-2 ${
        size === "fixed" ? "h-[46px] w-[162px]" : "w-full"
      }`}
    >
      <View className="h-[22px] w-[22px] items-center justify-center">
        <Image source={icon} className="h-4 w-4" resizeMode="contain" />
      </View>
      <View className="flex-1 flex-col items-start gap-1">
        <Text className="font-pretendard text-14 font-semibold leading-[22px] text-gray-500">
          {label}
        </Text>
        <View
          className={`w-full flex-col items-start ${lines.length > 1 ? "gap-3" : ""}`}
        >
          {lines.map((line, index) => (
            <Text
              key={index}
              className="text-label-m w-full text-gray-900"
            >
              {line}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}
