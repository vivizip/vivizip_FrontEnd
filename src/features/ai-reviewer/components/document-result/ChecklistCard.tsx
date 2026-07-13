import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  icon: ImageSourcePropType;
  titleIcon?: ImageSourcePropType;
  title: string;
  items: string[];
  compact?: boolean;
};

/**
 * "계약 전 확인해보세요" 체크리스트 카드 (Figma)
 * - bg #FAFAFD, radius 16px, padding 16px 24px, gap 12px, shadow 0 0 4px rgba(0,0,0,0.1)
 * - 제목(Title-m) gray-900 + 구분선(gray-200) + 체크 항목(gap 6px, 각 행 gap 8px, Label-s gray-600)
 */
export default function ChecklistCard({
  icon,
  titleIcon,
  title,
  items,
  compact = false,
}: Props) {
  return (
    <View
      className={`w-full flex-col items-start bg-[#FAFAFD] px-4 ${
        compact ? "gap-2 rounded-[20px] pb-3 pt-4" : "gap-3 rounded-2xl py-6"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: compact ? 2 : 0 },
        shadowOpacity: compact ? 0.08 : 0.1,
        shadowRadius: compact ? 6 : 4,
        elevation: 2,
      }}
    >
      <View className="w-full flex-row items-center gap-2">
        {titleIcon && (
          <Image
            source={titleIcon}
            className="h-6 w-6"
            resizeMode="contain"
            style={{ width: 24, height: 24 }}
          />
        )}
        <Text
          className={
            compact
              ? "font-pretendard text-16 font-semibold leading-6 tracking-[-0.16px] text-[#191F28]"
              : "text-title-m text-gray-900"
          }
        >
          {title}
        </Text>
      </View>
      <View className="h-px w-full bg-gray-200" />
      <View className={`w-full flex-col items-start ${compact ? "" : "gap-1.5"}`}>
        {items.map((item, index) => (
          <View
            key={index}
            className={`w-full flex-row items-center gap-2 ${compact ? "py-1" : ""}`}
          >
            <Image source={icon} className="h-4 w-4" resizeMode="contain" />
            <Text
              className={
                compact
                  ? "flex-1 font-pretendard text-14 font-normal leading-[22.75px] text-[#4E5968]"
                  : "flex-1 text-label-s text-gray-600"
              }
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
