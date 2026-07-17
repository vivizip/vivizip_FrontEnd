import React from "react";
import { Text, View } from "react-native";

import ProcessBar from "./ProcessBar";

const STAGES = ["메이트 매칭", "집 구하는 중", "계약서 검토"] as const;

/**
 * "부메랑 진행과정" 섹션 (Figma node 1915:33497).
 * TODO(1:1 매칭 미구현): 실제 진행 상태 데이터가 없어 1단계("메이트 매칭") 고정 표시.
 */
export default function MatchingProgressCard() {
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
          <ProcessBar stages={STAGES} activeIndex={0} />
        </View>

        <View className="w-full gap-0.5 px-4 pb-2 mt-2">
          <Text className="w-full text-left font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800">
            부동산 메이트를 구해요
          </Text>
          <Text className="w-full text-left font-pretendard-semibold text-12 font-semibold text-gray-400">
            계약 전에 서류를 검토하고 위험요소가 없는지 살펴보세요
          </Text>
        </View>
      </View>
    </View>
  );
}
