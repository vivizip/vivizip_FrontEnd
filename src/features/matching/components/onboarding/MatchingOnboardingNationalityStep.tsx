import React, { useEffect, useState } from "react";
import { View } from "react-native";

import WheelPicker from "../../../../components/WheelPicker";
import { getNationalityOptions } from "../../services/optionsApi";
import { useToastStore } from "../../../../store/useToastStore";
import type { MatchingNationality } from "../../types";

type Props = {
  nationality: MatchingNationality;
  onSelectNationality: (nationality: MatchingNationality) => void;
};

/**
 * 부메랑 신청 온보딩 - 국적 선택 콘텐츠 (Figma node 1883:31457).
 * 마이페이지 언어 선택 시트와 동일한 공용 WheelPicker(iOS 스타일 스크롤 휠)를 쓴다.
 * 목록은 GET /api/options/nationalities에서 불러온다. TopBar/진행률바/CTA는
 * MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingNationalityStep({
  nationality,
  onSelectNationality,
}: Props) {
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getNationalityOptions()
      .then((options) => {
        const mapped = options.map((option) => ({
          value: option.code,
          label: option.label,
        }));
        setItems(mapped);
        if (!mapped.some((item) => item.value === nationality) && mapped[0]) {
          onSelectNationality(mapped[0].value);
        }
      })
      .catch(() => {
        useToastStore
          .getState()
          .show("국적 목록을 불러오지 못했어요. 다시 시도해주세요.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return <View className="w-full items-center px-4 pt-16" />;
  }

  return (
    <View className="w-full items-center px-4 pt-16">
      <WheelPicker items={items} value={nationality} onChange={onSelectNationality} />
    </View>
  );
}
