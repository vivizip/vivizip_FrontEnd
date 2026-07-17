import React from "react";
import { Text, View } from "react-native";

const STAGE_LABELS = ["계약 전", "계약 중", "계약 후"] as const;

type Props = {
  /** 상단 말풍선 배지 문구 */
  badgeLabel: string;
  /** 현재 강조할 단계 (1: 계약전, 2: 계약중, 3: 계약후) */
  activeStage: 1 | 2 | 3;
};

/**
 * 온보딩 1~3단계 상단 공통 헤더 (Figma node 1212:14954 등).
 * 말풍선 배지 + "계약 전/중/후" 가로 스테퍼(연결선 + 강조 색상).
 */
export default function StageProgressHeader({
  badgeLabel,
  activeStage,
}: Props) {
  return (
    <View className="w-full gap-3 px-5 py-3">
      <View className="items-end">
        <View className="items-center">
          <View className="w-full items-center rounded-lg bg-[#F2F7FC] px-4 py-3">
            <Text className="whitespace-nowrap font-pretendard-semibold text-12 font-semibold leading-[18px] text-primary-500">
              {badgeLabel}
            </Text>
          </View>
          <View className="-mt-1 h-2 w-2 rotate-45 bg-[#F2F7FC]" />
        </View>
      </View>

      <View className="relative w-full flex-row items-start justify-between px-5">
        <View
          className="absolute top-3 h-px bg-gray-200"
          style={{ left: 26, right: 26 }}
        />
        {STAGE_LABELS.map((label, index) => {
          const stageNumber = index + 1;
          const isActive = stageNumber === activeStage;
          return (
            <View key={label} className="w-10 items-center gap-1">
              <View
                className={`h-6 w-6 items-center justify-center rounded-full ${
                  isActive ? "bg-primary-500" : "bg-gray-500"
                }`}
              >
                <Text className="text-center font-pretendard-semibold text-12 font-semibold text-[#EEF6FF]">
                  {stageNumber}
                </Text>
              </View>
              <Text
                className={`whitespace-nowrap font-pretendard-semibold text-12 font-semibold ${
                  isActive ? "text-primary-500" : "text-gray-600"
                }`}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
