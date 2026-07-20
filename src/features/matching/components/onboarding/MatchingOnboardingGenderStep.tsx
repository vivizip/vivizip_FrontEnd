import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

import GenderOptionCard from "./GenderOptionCard";
import { getGenderOptions, type OptionItem } from "../../services/optionsApi";
import { useToastStore } from "../../../../store/useToastStore";
import type { MatchingGender } from "../../types";

const maleImage = require("../../../../../assets/images/img_male_pig.png");
const femaleImage = require("../../../../../assets/images/img_female_pig.png");

const FALLBACK_MALE: OptionItem = { code: "MALE", label: "남자" };
const FALLBACK_FEMALE: OptionItem = { code: "FEMALE", label: "여자" };
const FALLBACK_UNSPECIFIED: OptionItem = {
  code: "NOT_SPECIFIED",
  label: "밝히고 싶지 않음",
};

type Props = {
  gender: MatchingGender | null;
  onSelectGender: (gender: MatchingGender) => void;
};

/**
 * 부메랑 신청 온보딩 - 성별 선택 콘텐츠
 * (Figma node 1883:31725 미선택, 1883:31742 "여자" 선택 상태).
 * 카드 3개(남자/여자/밝히고 싶지 않음) 구조는 고정이고, 각 코드/라벨만
 * GET /api/options/genders 응답으로 채운다(못 불러오면 기존 목업 값으로 대체).
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingGenderStep({
  gender,
  onSelectGender,
}: Props) {
  const [maleOption, setMaleOption] = useState(FALLBACK_MALE);
  const [femaleOption, setFemaleOption] = useState(FALLBACK_FEMALE);
  const [unspecifiedOption, setUnspecifiedOption] = useState(
    FALLBACK_UNSPECIFIED,
  );

  useEffect(() => {
    getGenderOptions()
      .then((options) => {
        const male = options.find((o) => o.code.toUpperCase() === "MALE");
        const female = options.find((o) => o.code.toUpperCase() === "FEMALE");
        const rest = options.find((o) => o !== male && o !== female);
        if (male) setMaleOption(male);
        if (female) setFemaleOption(female);
        if (rest) setUnspecifiedOption(rest);
      })
      .catch(() => {
        useToastStore
          .getState()
          .show("성별 목록을 불러오지 못했어요. 다시 시도해주세요.");
      });
  }, []);

  return (
    <View className="w-full gap-4 px-6 pt-9">
      <View className="w-full flex-row gap-3">
        <GenderOptionCard
          label={maleOption.label}
          image={maleImage}
          selected={gender === maleOption.code}
          onPress={() => onSelectGender(maleOption.code)}
        />
        <GenderOptionCard
          label={femaleOption.label}
          image={femaleImage}
          selected={gender === femaleOption.code}
          onPress={() => onSelectGender(femaleOption.code)}
        />
      </View>

      <Pressable
        onPress={() => onSelectGender(unspecifiedOption.code)}
        className={`h-[54px] items-center justify-center rounded-lg border px-8 py-4 active:opacity-80 ${
          gender === unspecifiedOption.code
            ? "border-transparent bg-primary-100"
            : "border-gray-200 bg-white"
        }`}
        accessibilityRole="button"
        accessibilityLabel={unspecifiedOption.label}
        accessibilityState={{ selected: gender === unspecifiedOption.code }}
      >
        <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
          {unspecifiedOption.label}
        </Text>
      </Pressable>
    </View>
  );
}
