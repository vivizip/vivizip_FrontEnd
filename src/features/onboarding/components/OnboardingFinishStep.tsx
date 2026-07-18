import React from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CTAButton from "../../../components/CTAButton";

const finishIllustration = require("../../../../assets/images/img_onboarding_finish.png");

type Props = {
  onGoHome: () => void;
  onMatchFriends: () => void;
};

/**
 * 온보딩 마지막 단계 (Figma node 1212:15044).
 * "친구 매칭하기"는 부메랑 신청 온보딩(/matching/onboarding)으로 이동한다.
 */
export default function OnboardingFinishStep({
  onGoHome,
  onMatchFriends,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 justify-between px-4 pt-20">
        <View className="w-full items-center gap-6 pt-[60px]">
          <View className="w-full gap-2.5 mb-[50px]">
            <Text className="text-center font-pretendard-semibold text-22 font-semibold leading-[30px] text-primary-500">
              튜토리얼 완료!
            </Text>
            <Text className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              계약 전·중·후 과정을 무사히 거쳐서{"\n"}
              아기돼지가 무사히 벽돌집을 지을 수 있도록 도와주세요
            </Text>
          </View>
          <Image
            source={finishIllustration}
            style={{ width: 252, height: 206 }}
            resizeMode="contain"
          />
        </View>

        <View className="w-full items-center justify-between gap-2 pb-14">
          <CTAButton
            label="친구 매칭하기"
            active
            onPress={onMatchFriends}
            heightClassName="h-12"
            radiusClassName="rounded-xl"
          />
          <CTAButton
            label="홈화면으로"
            active
            onPress={onGoHome}
            heightClassName="h-12"
            radiusClassName="rounded-xl"
            bgClassName="bg-gray-50 active:opacity-70"
            textClassName="text-gray-600"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
