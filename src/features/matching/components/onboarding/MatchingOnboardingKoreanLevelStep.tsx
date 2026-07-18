import React from "react";
import { Pressable, Text, View } from "react-native";

import CheckIcon from "../../../../../assets/icons/icon_check.svg";
import type { MatchingKoreanLevel } from "../../types";

const LEVELS: { id: MatchingKoreanLevel; label: string }[] = [
  { id: "greeting", label: "간단한 인사만 가능해요" },
  { id: "daily", label: "일상 대화는 가능해요" },
  { id: "fluent", label: "대부분 자유롭게 대화할 수 있어요" },
];

type Props = {
  level: MatchingKoreanLevel | null;
  onSelectLevel: (level: MatchingKoreanLevel) => void;
};

/**
 * 부메랑 신청 온보딩(유학생) - 한국어 대화 수준 선택 콘텐츠
 * (Figma node 1883:31471 미선택, 1883:31486 "일상 대화는 가능해요" 선택 상태).
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingKoreanLevelStep({
  level,
  onSelectLevel,
}: Props) {
  return (
    <View className="w-full gap-3 px-4 pt-16">
      {LEVELS.map((item) => {
        const isSelected = item.id === level;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelectLevel(item.id)}
            className={`w-full flex-row items-center justify-center gap-1 rounded-xl border p-2.5 active:opacity-80 ${
              isSelected
                ? "border-transparent bg-primary-100"
                : "border-gray-200 bg-white"
            }`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: isSelected }}
          >
            {isSelected && <CheckIcon width={24} height={24} color="#2C74F2" />}
            <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-700">
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
