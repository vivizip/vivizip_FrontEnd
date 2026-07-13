import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { DOCUMENT_STEPS } from "../../constants";
import { useRegisteredHouseStore } from "../../store/useRegisteredHouseStore";
import { useDocumentProgressStore } from "../../store/useDocumentProgressStore";
import DocumentItem from "./DocumentItem";

// 단계별로 미완료 항목에 표시할 chip-s 라벨
const CHIP_LABEL_BY_STEP: Record<string, string> = {
  before: "발급하기",
  during: "분석하기",
  after: "확인하기",
};

/**
 * 계약 단계별 문서 체크리스트 (세로 타임라인 + 단계별 문서 목록).
 * 집이 등록되면 1단계(계약전)가 활성화되고, 계약전 항목(등기부등본/건축물대장)이
 * 모두 발급 완료되면 2단계(계약중)가 활성화된다 (Figma):
 * - 문서 목록 배경: primary-10(#F2F7FC)
 * - 번호 뱃지 배경/발급하기 chip 배경: primary-500, 텍스트: #F2F7FC
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정.
 */
export default function DocumentChecklist() {
  const router = useRouter();
  const hasHouse = useRegisteredHouseStore((state) => state.address !== null);
  const completedItemIds = useDocumentProgressStore(
    (state) => state.completedItemIds,
  );
  const isBeforeComplete =
    completedItemIds.includes("register") && completedItemIds.includes("building");

  const handlePressDocument = (itemId: string) => {
    if (itemId === "register") {
      router.push({
        pathname: "/ai-reviewer/before/register-document",
        params: { documentType: "registry" },
      });
      return;
    }

    if (itemId === "building") {
      router.push({
        pathname: "/ai-reviewer/before/register-document",
        params: { documentType: "building" },
      });
      return;
    }

    if (itemId === "brokerage") {
      router.push("/ai-reviewer/during/brokerage-info");
    }
  };

  return (
    <View>
      {DOCUMENT_STEPS.map((step, stepIndex) => {
        const isLastStep = stepIndex === DOCUMENT_STEPS.length - 1;
        // 계약전은 등록된 집 유무로, 계약중은 계약전 완료 여부로 활성화된다
        const isStepActive =
          (stepIndex === 0 && hasHouse) || (stepIndex === 1 && isBeforeComplete);
        const chipLabel = CHIP_LABEL_BY_STEP[step.id];

        return (
          <View key={step.id} className="flex-row gap-3">
            {/* 왼쪽 타임라인: 번호 원 + 다음 단계로 이어지는 세로선 */}
            <View className="items-center">
              {/* Figma: 24x24 원, radius 500, bg gray-50(활성 시 primary-500) / 텍스트 gray-300(활성 시 #F2F7FC) */}
              <View
                className={`h-6 w-6 items-center justify-center rounded-[500px] ${
                  isStepActive ? "bg-primary-500" : "bg-gray-50"
                }`}
              >
                <Text
                  className={`text-center font-pretendard-semibold text-14 font-semibold leading-[22px] ${
                    isStepActive ? "text-[#F2F7FC]" : "text-gray-300"
                  }`}
                >
                  {stepIndex + 1}
                </Text>
              </View>
              {!isLastStep && <View className="my-1 w-px flex-1 bg-gray-100" />}
            </View>

            {/* 오른쪽: 단계 제목 + 문서 목록 */}
            <View className={`flex-1 gap-3 ${isLastStep ? "" : "pb-10"}`}>
              {/* Figma: Title-m (Pretendard 18/600, lh 26), gray-400(활성 시 gray-900) */}
              <Text
                className={`font-pretendard-semibold text-18 font-semibold leading-[26px] ${
                  isStepActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.title}
              </Text>
              <View
                className={`overflow-hidden rounded-xl ${
                  isStepActive ? "bg-[#F2F7FC]" : "bg-gray-50"
                }`}
              >
                {step.items.map((item, itemIndex) => {
                  const hasScreen =
                    item.id === "register" ||
                    item.id === "building" ||
                    item.id === "brokerage";

                  return (
                    <DocumentItem
                      key={item.id}
                      name={item.name}
                      isLast={itemIndex === step.items.length - 1}
                      isActive={isStepActive}
                      isCompleted={completedItemIds.includes(item.id)}
                      chipLabel={chipLabel}
                      onPress={
                        hasScreen && isStepActive
                          ? () => handlePressDocument(item.id)
                          : undefined
                      }
                    />
                  );
                })}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
