import React from "react";
import { Image, View } from "react-native";

const finishPigIllustration = require("../../../../assets/images/img_boomerang_finish_pig.png");

/**
 * 부메랑 신청 온보딩 마지막 단계 콘텐츠 (Figma node 2305:34098, "온보딩 끝").
 * 다른 단계와 동일하게 MatchingOnboardingStepShell 안에 끼워 넣는 콘텐츠라
 * 일러스트만 담당한다 - 질문/부제목/CTA("완료")는 셸과 오케스트레이터가 처리한다.
 */
export default function MatchingOnboardingFinishStep() {
  return (
    <View className="w-full items-center pt-16">
      <Image
        source={finishPigIllustration}
        style={{ width: 357, height: 294 }}
        resizeMode="contain"
      />
    </View>
  );
}
