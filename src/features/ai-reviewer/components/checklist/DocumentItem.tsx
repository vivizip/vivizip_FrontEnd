import React from "react";
import { Pressable, Text, View } from "react-native";

import ChipS from "../../../../components/ChipS";
import ChipM from "../../../../components/ChipM";

const rightIcon = require("../../../../../assets/icons/ic_right.png");

type Props = {
  name: string;
  isLast?: boolean;
  /** 이 단계(계약전 등)가 등록된 집으로 인해 활성화됐는지 */
  isActive?: boolean;
  /** 이 항목의 발급/분석이 완료됐는지 - 완료 시 "분석완료" chip-m으로 대체 */
  isCompleted?: boolean;
  /** 미완료 상태에서 chip-s에 표시할 라벨 (단계별로 다름: 발급하기/분석하기/확인하기) */
  chipLabel?: string;
  onPress?: () => void;
};

/**
 * 문서 한 줄 (문서명 + 발급하기 chip-s / 완료 시 분석완료 chip-m).
 * 활성화 시 chip 배경 primary-500, 텍스트 #F2F7FC로 변경 (Figma).
 */
export default function DocumentItem({
  name,
  isLast = false,
  isActive = false,
  isCompleted = false,
  chipLabel = "발급하기",
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`h-[52px] flex-row items-center justify-between px-4 active:opacity-70 ${
        isLast ? "" : "border-b border-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={`${name} ${isCompleted ? "분석완료" : chipLabel}`}
    >
      {/* Figma: Label-m (Pretendard 14/500, lh 20), gray-400(활성 시 gray-900) */}
      <Text
        className={`font-pretendard-medium text-14 font-medium leading-5 ${
          isActive ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {name}
      </Text>
      {/* ChipM은 self-start라 부모의 items-center를 못 받음 - 래퍼로 감싸 세로 중앙 정렬 */}
      <View>
        {isCompleted ? (
          <ChipM
            label="분석완료"
            icon={rightIcon}
            iconTintColor="#2C74F2"
            textClassName="text-primary-500"
            bgClassName=""
          />
        ) : (
          <ChipS
            label={chipLabel}
            bgClassName={isActive ? "bg-primary-500" : "bg-gray-100"}
            textClassName={isActive ? "text-[#F2F7FC]" : undefined}
          />
        )}
      </View>
    </Pressable>
  );
}
