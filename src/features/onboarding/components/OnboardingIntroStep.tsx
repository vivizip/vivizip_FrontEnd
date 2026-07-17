import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CTAButton from "../../../components/CTAButton";
import FeatureCardList from "./FeatureCardList";

type Props = {
  onNext: () => void;
};

/**
 * 온보딩 0단계 - 서비스 소개 (Figma node 1212:14974).
 */
export default function OnboardingIntroStep({ onNext }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 justify-between px-4 pt-16">
        <View className="w-full gap-7">
          <View className="w-full items-center gap-2">
            <Text className="text-center font-pretendard-semibold text-22 font-semibold leading-[30px] text-gray-700">
              Hello, VIVIZIP
            </Text>
            <Text className="text-center font-pretendard-semibold text-22 font-semibold leading-[30px] text-gray-700">
              반가워요, 집 찾기{" "}
              <Text className="text-primary-500">전·중·후</Text>
              {"\n"}케어를 도와줄게요
            </Text>
          </View>

          <FeatureCardList />
        </View>

        <View className="w-full gap-2 pb-14">
          <Text className="text-center font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-black/60">
            단계별로 더 자세히 알려드릴게요
          </Text>
          <CTAButton
            label="다음으로"
            active
            onPress={onNext}
            heightClassName="h-12"
            radiusClassName="rounded-xl"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
