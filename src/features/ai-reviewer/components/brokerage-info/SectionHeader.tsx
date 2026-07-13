import React from "react";
import { Text, View } from "react-native";

import Badge from "../../../../components/Badge";

type Props = {
  title: string;
  badgeLabel: string;
};

/**
 * 중개대상물 확인 설명서 화면의 섹션 제목 + 안내 배지 (3개 섹션 공통)
 */
export default function SectionHeader({ title, badgeLabel }: Props) {
  return (
    <View className="w-full items-center gap-2">
      <Text className="text-title-m text-center text-gray-900">{title}</Text>
      <View>
        <Badge label={badgeLabel} />
      </View>
    </View>
  );
}
