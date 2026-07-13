import React from "react";
import { Text, View } from "react-native";

type Example = {
  label: string;
  description: string;
};

const EXAMPLES: Example[] = [
  { label: "도로명", description: "예) 무학로 33, 도산대로 8길 23" },
  { label: "동주소", description: "풍무동 10113" },
  { label: "건물명", description: "풍무 센트럴 푸르지오" },
];

/**
 * "이렇게 검색해 보세요" 안내 목록 (Figma)
 * - 타이틀: Body/body-s (Pretendard 14/600, lh 22), gray-900
 * - 라벨(도로명/동주소/건물명): Body/body-s(14/600, lh 22), gray-600
 * - 설명: Label/Label-s(12/600, lh 18), gray-400
 */
export default function SearchExampleList() {
  return (
    <View className="gap-4">
      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
        이렇게 검색해 보세요
      </Text>
      <View className="gap-2">
        {EXAMPLES.map((example) => (
          <View key={example.label} className="flex-row items-center gap-2">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              {example.label}
            </Text>
            <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-400">
              {example.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
