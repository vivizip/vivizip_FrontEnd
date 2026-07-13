import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

import Badge from "../../../../components/Badge";

type Props = {
  number: string;
  icon: ImageSourcePropType;
  title: string;
  description: string;
};

/**
 * 임대차 계약서 화면의 01/02/03 번호 카드 (Figma)
 * - bg gray-10(#FAFAFD), radius 16px, padding 16px 12px, gap 12px
 * - 번호는 공통 Badge 컴포넌트를 어두운 톤으로 override해서 사용
 */
export default function NumberedFeatureCard({
  number,
  icon,
  title,
  description,
}: Props) {
  return (
    <View className="w-full items-center gap-3 rounded-2xl bg-[#FAFAFD] px-4 py-3">
      <View className="items-center gap-2">
        {/* Badge는 self-start라 부모의 items-center를 못 받음 - 래퍼로 감싸 가로 중앙 정렬 */}
        <View>
          <Badge label={number} bgClassName="bg-gray-800" textClassName="text-[#FAFAFD]" />
        </View>
        <Image source={icon} className="h-12 w-[55px]" resizeMode="contain" />
      </View>
      <View className="items-center gap-1">
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-900">
          {title}
        </Text>
        <Text
          className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px]"
          style={{ color: "rgba(0, 0, 0, 0.53)" }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
