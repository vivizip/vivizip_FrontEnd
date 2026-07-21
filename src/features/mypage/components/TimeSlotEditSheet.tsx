import React, { useState } from "react";
import { Text, View } from "react-native";

import CTAButton from "../../../components/CTAButton";
import MatchingOnboardingTimeSlotStep from "../../matching/components/onboarding/MatchingOnboardingTimeSlotStep";

type Props = {
  initialSelected: Set<string>;
  onConfirm: (selected: Set<string>) => void;
  isSubmitting?: boolean;
};

/**
 * 마이페이지 "나의 활동 시간대" 편집 바텀시트 (Figma node 1705:28420 하단, "활동 가능한
 * 시간대를 모두 선택해주세요"). 그리드 자체는 매칭 온보딩의 MatchingOnboardingTimeSlotStep을
 * 그대로 재사용한다 - 요일×시간대 칸/토글 로직이 완전히 동일한 디자인이라 중복 구현하지 않는다.
 * 선택은 로컬 draft 상태로 관리하다가 "입력 완료"를 눌러야 확정된다(언어 선택 시트와 동일 패턴).
 */
export default function TimeSlotEditSheet({
  initialSelected,
  onConfirm,
  isSubmitting = false,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(initialSelected),
  );

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <View className="w-full items-center gap-8">
      <View className="w-full gap-0.5 px-4">
        <Text className="w-full font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
          활동 가능한 시간대를 모두 선택해주세요
        </Text>
        <Text className="w-full font-pretendard-medium text-14 font-medium leading-5 text-gray-500">
          겹치는 시간대를 우선적으로 매칭해드려요
        </Text>
      </View>

      <MatchingOnboardingTimeSlotStep
        selected={selected}
        onToggle={toggle}
        className="w-full items-center px-4"
      />

      <View className="w-full px-4">
        <CTAButton
          label={isSubmitting ? "저장 중..." : "입력 완료"}
          active={!isSubmitting}
          onPress={() => onConfirm(selected)}
        />
      </View>
    </View>
  );
}
