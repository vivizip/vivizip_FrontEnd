import React from "react";
import { Pressable, Text, View } from "react-native";

import type { MatchingNationality } from "../types";

const NATIONALITIES: { id: MatchingNationality; label: string }[] = [
  { id: "vietnam", label: "베트남" },
  { id: "china", label: "중국" },
  { id: "korea", label: "한국" },
  { id: "nepal", label: "네팔" },
  { id: "indonesia", label: "인도네시아" },
];

type Props = {
  nationality: MatchingNationality;
  onSelectNationality: (nationality: MatchingNationality) => void;
};

/**
 * 부메랑 신청 온보딩 - 국적 선택 콘텐츠 (Figma node 1883:31457).
 * Figma는 휠 피커처럼 보이지만 항목이 5개뿐이라 전부 동시에 노출되므로,
 * 실제 스크롤 휠 대신 탭으로 선택하고 선택 위치와의 거리로 글자 크기/색을 다르게 해
 * 같은 시각 효과를 낸다. TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingNationalityStep({
  nationality,
  onSelectNationality,
}: Props) {
  const selectedIndex = NATIONALITIES.findIndex((n) => n.id === nationality);

  return (
    <View className="w-full items-center gap-2 px-4 pt-32">
      {NATIONALITIES.map((nation, index) => {
        const distance = Math.abs(index - selectedIndex);
        const isSelected = distance === 0;
        const textSizeClass =
          distance === 0 ? "text-18" : distance === 1 ? "text-16" : "text-14";
        const textColorClass =
          distance === 0
            ? "text-gray-900"
            : distance === 1
              ? "text-gray-500"
              : "text-gray-300";

        return (
          <Pressable
            key={nation.id}
            onPress={() => onSelectNationality(nation.id)}
            className={`w-full items-center justify-center rounded-xl py-2.5 ${
              isSelected ? "bg-primary-100" : ""
            }`}
            accessibilityRole="button"
            accessibilityLabel={nation.label}
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              className={`font-pretendard-semibold font-semibold ${textSizeClass} ${textColorClass}`}
            >
              {nation.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
