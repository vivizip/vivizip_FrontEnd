import React from "react";
import { View } from "react-native";

import WheelPicker from "../../../../components/WheelPicker";
import type { MatchingNationality } from "../../types";

const NATIONALITIES: { value: MatchingNationality; label: string }[] = [
  { value: "vietnam", label: "베트남" },
  { value: "china", label: "중국" },
  { value: "korea", label: "한국" },
  { value: "nepal", label: "네팔" },
  { value: "indonesia", label: "인도네시아" },
];

type Props = {
  nationality: MatchingNationality;
  onSelectNationality: (nationality: MatchingNationality) => void;
};

/**
 * 부메랑 신청 온보딩 - 국적 선택 콘텐츠 (Figma node 1883:31457).
 * 마이페이지 언어 선택 시트와 동일한 공용 WheelPicker(iOS 스타일 스크롤 휠)를 쓴다.
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingNationalityStep({
  nationality,
  onSelectNationality,
}: Props) {
  return (
    <View className="w-full items-center px-4 pt-16">
      <WheelPicker
        items={NATIONALITIES}
        value={nationality}
        onChange={onSelectNationality}
      />
    </View>
  );
}
