import React from "react";
import { Image, View } from "react-native";

const pigIllustration = require("../../../../assets/images/img_boomerang_pig.png");

/**
 * 부메랑 신청 온보딩 - 환영 인사 콘텐츠 (Figma node 1879:30488, "온보딩 시작").
 * TopBar/진행률바/인사말/CTA는 MatchingOnboardingStepShell이 담당하고,
 * 이 컴포넌트는 일러스트만 담당한다.
 */
export default function MatchingOnboardingWelcomeStep() {
  return (
    <View className="w-full items-center pt-16">
      <Image
        source={pigIllustration}
        style={{ width: 333, height: 277 }}
        resizeMode="contain"
      />
    </View>
  );
}
