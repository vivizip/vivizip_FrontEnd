import React from "react";
import { Text, View } from "react-native";

import { DOCUMENT_STEPS } from "../../constants";
import DocumentItem from "./DocumentItem";

/**
 * 계약 단계별 문서 체크리스트 (세로 타임라인 + 단계별 문서 목록).
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정.
 */
export default function DocumentChecklist() {
  return (
    <View>
      {DOCUMENT_STEPS.map((step, stepIndex) => {
        const isLastStep = stepIndex === DOCUMENT_STEPS.length - 1;
        return (
          <View key={step.id} className="flex-row gap-3">
            {/* 왼쪽 타임라인: 번호 원 + 다음 단계로 이어지는 세로선 */}
            <View className="items-center">
              {/* Figma: 24x24 원, radius 500, bg gray-50 / 텍스트 body-s(14/600, lh 22), gray-300 */}
              <View className="h-6 w-6 items-center justify-center rounded-[500px] bg-gray-50">
                <Text className="text-center font-pretendard text-14 font-semibold leading-[22px] text-gray-300">
                  {stepIndex + 1}
                </Text>
              </View>
              {!isLastStep && <View className="my-1 w-px flex-1 bg-gray-100" />}
            </View>

            {/* 오른쪽: 단계 제목 + 문서 목록 */}
            <View className={`flex-1 gap-3 ${isLastStep ? "" : "pb-10"}`}>
              {/* Figma: Title-m (Pretendard 18/600, lh 26), gray-400 */}
              <Text className="font-pretendard text-18 font-semibold leading-[26px] text-gray-400">
                {step.title}
              </Text>
              <View className="overflow-hidden rounded-xl bg-gray-50">
                {step.items.map((item, itemIndex) => (
                  <DocumentItem
                    key={item.id}
                    name={item.name}
                    isLast={itemIndex === step.items.length - 1}
                  />
                ))}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
