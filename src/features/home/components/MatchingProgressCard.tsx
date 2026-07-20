import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { useFocusEffect } from "expo-router";

import ProcessBar from "./ProcessBar";
import {
  getBoomerangProgress,
  type ProgressStep,
} from "../services/progressApi";

const STAGES = ["메이트 매칭", "집 구하는 중", "계약서 검토"] as const;

const STEP_COPY: Record<ProgressStep, { title: string; subtitle: string }> = {
  1: {
    title: "부동산 메이트를 구해요",
    subtitle: "계약 전에 서류를 검토하고 위험요소가 없는지 살펴보세요",
  },
  2: {
    title: "계약 전 집 정보를 확인하세요",
    subtitle: "계약 전에 서류를 검토하고 위험요소가 없는지 살펴보세요",
  },
  3: {
    title: "최종 계약서에 서명하기 전에 꼭 확인하세요",
    subtitle: "계약 관련 서류를 마지막으로 검토하고 입주 절차를 밟으세요",
  },
};

/**
 * "부메랑 진행과정" 섹션 (Figma node 1915:33497).
 * GET /api/lease-cases/progress의 currentStep(1~3)을 그대로 받아 ProcessBar의
 * activeIndex(0~2)로 변환한다. 판단 기준(매칭 완료 여부, 임대차 계약서 검토 완료
 * 여부)은 전부 서버가 계산하므로 홈 화면은 값을 표시만 한다. 홈 포커스마다
 * 새로고침(BoomerangBannerCard와 동일한 패턴).
 */
export default function MatchingProgressCard() {
  const [currentStep, setCurrentStep] = useState<ProgressStep>(1);

  useFocusEffect(
    useCallback(() => {
      getBoomerangProgress()
        .then((res) => setCurrentStep(res.currentStep))
        .catch((err) => {
          console.log("[Home] getBoomerangProgress failed:", String(err));
        });
    }, []),
  );

  const copy = STEP_COPY[currentStep];

  return (
    <View className="w-full gap-2">
      <View className="w-full flex-row items-center justify-between">
        <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
          부메랑 진행과정
        </Text>
      </View>

      <View
        className="w-full items-end gap-2 rounded-xl bg-white pb-4 pt-5"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        <View className="w-full px-4 py-3">
          <ProcessBar stages={STAGES} activeIndex={currentStep - 1} />
        </View>

        <View className="w-full gap-0.5 px-4 pb-2 mt-2">
          <Text className="w-full text-left font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800">
            {copy.title}
          </Text>
          <Text className="w-full text-left font-pretendard-semibold text-12 font-semibold text-gray-400">
            {copy.subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
