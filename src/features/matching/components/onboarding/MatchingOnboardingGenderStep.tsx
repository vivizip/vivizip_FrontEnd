import React from "react";
import { Pressable, Text, View } from "react-native";

import GenderOptionCard from "./GenderOptionCard";
import type { MatchingGender } from "../../types";

const maleImage = require("../../../../../assets/images/img_male_pig.png");
const femaleImage = require("../../../../../assets/images/img_female_pig.png");

type Props = {
  gender: MatchingGender | null;
  onSelectGender: (gender: MatchingGender) => void;
};

/**
 * 부메랑 신청 온보딩 - 성별 선택 콘텐츠
 * (Figma node 1883:31725 미선택, 1883:31742 "여자" 선택 상태).
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당한다.
 */
export default function MatchingOnboardingGenderStep({
  gender,
  onSelectGender,
}: Props) {
  return (
    <View className="w-full gap-4 px-6 pt-9">
      <View className="w-full flex-row gap-3">
        <GenderOptionCard
          label="남자"
          image={maleImage}
          selected={gender === "male"}
          onPress={() => onSelectGender("male")}
        />
        <GenderOptionCard
          label="여자"
          image={femaleImage}
          selected={gender === "female"}
          onPress={() => onSelectGender("female")}
        />
      </View>

      <Pressable
        onPress={() => onSelectGender("unspecified")}
        className={`h-[54px] items-center justify-center rounded-lg border px-8 py-4 active:opacity-80 ${
          gender === "unspecified"
            ? "border-transparent bg-primary-100"
            : "border-gray-200 bg-white"
        }`}
        accessibilityRole="button"
        accessibilityLabel="밝히고 싶지 않음"
        accessibilityState={{ selected: gender === "unspecified" }}
      >
        <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
          밝히고 싶지 않음
        </Text>
      </Pressable>
    </View>
  );
}
