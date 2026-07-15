import React from "react";
import { Pressable, Text, View } from "react-native";

import ChipS from "../../../../components/ChipS";

const ISSUE_OPTIONS = [
  "벽지",
  "곰팡이",
  "타일깨짐",
  "햇빛",
  "보일러",
  "소음",
  "냄새",
  "가구",
  "누수",
];

type Props = {
  selected: string[];
  onToggle: (issue: string) => void;
  /** false로 주면 안내 문구를 숨긴다 (기본 true) */
  showTitle?: boolean;
};

/**
 * "집에 하자가 있다면 선택해주세요" 다중 선택 칩 섹션 (Figma node 1064:9792)
 * - 칩: 공통 ChipS, 기본 bg-gray-100/text-gray-800, 선택 시 bg-primary-500/text-white
 */
export default function IssueChipSelector({
  selected,
  onToggle,
  showTitle = true,
}: Props) {
  return (
    <View className="w-full gap-2 my-6">
      {showTitle && (
        <Text className="w-full font-pretendard-semibold text-14 leading-[22px] text-gray-800">
          집에 하자가 있다면 선택해주세요
        </Text>
      )}
      <View className="w-full flex-row flex-wrap gap-[7px]">
        {ISSUE_OPTIONS.map((issue) => {
          const isSelected = selected.includes(issue);

          return (
            <Pressable
              key={issue}
              onPress={() => onToggle(issue)}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={issue}
            >
              <ChipS
                label={issue}
                bgClassName={isSelected ? "bg-primary-100" : "bg-gray-100"}
                textClassName={
                  isSelected ? "text-primary-500" : "text-gray-800"
                }
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
