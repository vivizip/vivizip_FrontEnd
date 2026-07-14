import React, { useState } from "react";
import { Image, Pressable, Text, View, type ImageSourcePropType } from "react-native";

const dropdownIcon = require("../../../../../assets/icons/ic_dropdown.png");

type Props = {
  icon: ImageSourcePropType;
  label: string;
  statusText: string;
  description: string;
  defaultExpanded?: boolean;
};

/**
 * 근저당권 등 위험 요소 아코디언 카드 (Figma) - 눌러서 설명 펼치기/접기
 * - bg secondary-50, border secondary-400, radius 16px, padding 16px 12px
 * - Figma는 펼침 상태 화면만 있어서, 접기 아이콘/애니메이션은 ic_dropdown 회전으로 직접 구성
 */
export default function RiskAccordionCard({
  icon,
  label,
  statusText,
  description,
  defaultExpanded = true,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Pressable
      onPress={() => setIsExpanded((prev) => !prev)}
      className="w-full gap-3 rounded-2xl border border-secondary-400 bg-secondary-50 px-4 py-3"
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
    >
      <View className="w-full flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          <Image source={icon} className="h-[18px] w-[18px]" resizeMode="contain" />
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-secondary-500">
            {label}
          </Text>
          <View className="h-5 w-px bg-secondary-400" />
          <Text className="flex-1 font-pretendard-semibold text-14 font-semibold leading-[22px] text-secondary-500">
            {statusText}
          </Text>
        </View>
        <Image
          source={dropdownIcon}
          className="h-6 w-6"
          resizeMode="contain"
          style={{
            tintColor: "#CB3D50",
            transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
          }}
        />
      </View>
      {isExpanded && (
        <Text className="w-full font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
          {description}
        </Text>
      )}
    </Pressable>
  );
}
