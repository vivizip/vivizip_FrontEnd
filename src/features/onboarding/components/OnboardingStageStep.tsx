import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CTAButton from "../../../components/CTAButton";
import StageProgressHeader from "./StageProgressHeader";
import IdeaTipCard from "./IdeaTipCard";

type Props = {
  badgeLabel: string;
  activeStage: 1 | 2 | 3;
  title: React.ReactNode;
  illustration: React.ReactNode;
  caption: string;
  tip: string;
  onNext: () => void;
};

/**
 * 온보딩 1~3단계 공통 셸 (Figma node 1212:14954 / 1212:15001 / 1212:15022).
 * 배지+스테퍼 헤더 → 제목 → 일러스트+캡션 → 팁 카드 → "다음으로" 버튼.
 */
export default function OnboardingStageStep({
  badgeLabel,
  activeStage,
  title,
  illustration,
  caption,
  tip,
  onNext,
}: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StageProgressHeader
          badgeLabel={badgeLabel}
          activeStage={activeStage}
        />

        <View className="w-full px-4 py-3 ">
          <View className="h-[70px] justify-center pl-7">
            <Text className="font-pretendard-semibold text-18 font-semibold leading-7 text-gray-700 ">
              {title}
            </Text>
          </View>
        </View>

        <View className="w-full gap-6 px-2.5 py-2.5">
          <View className="w-full items-center gap-0">
            {illustration}
            <Text className="w-full text-center font-pretendard-semibold text-12 font-semibold tracking-[-0.12px] text-black/40">
              {caption}
            </Text>
          </View>

          <View className="w-full px-4">
            <IdeaTipCard>{tip}</IdeaTipCard>
          </View>
        </View>
      </ScrollView>

      {/* 위 콘텐츠 높이가 단계마다 달라도 버튼 위치는 항상 하단으로 고정 */}
      <View className="w-full px-4 pb-14 pt-3">
        <CTAButton
          label="다음으로"
          active
          onPress={onNext}
          heightClassName="h-12"
          radiusClassName="rounded-xl"
        />
      </View>
    </SafeAreaView>
  );
}
