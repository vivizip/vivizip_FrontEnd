import React, { Fragment } from "react";
import { Text, View } from "react-native";

type Props = {
  stages: readonly string[];
  /** 현재 진행중인 단계 인덱스 (0부터 시작) - 이보다 앞선 단계는 완료, 뒤는 예정으로 표시 */
  activeIndex: number;
};

/**
 * 진행 단계 표시 바 (Figma node 2116:36202, "ProcessBar" - Default/Variant2/Variant3).
 * - 배지: 진행중(채워진 파란 배지, 흰 텍스트) / 완료(배경 없음, 파란 텍스트) / 예정(배경 없음, 회색 텍스트)
 * - 점: 진행중(10px, 두꺼운 파란 테두리) / 완료(8px, 파란 테두리) / 예정(8px, 회색 테두리)
 * - 연결선: 완료 구간(파란색) / 예정 구간(회색)
 */
export default function ProcessBar({ stages, activeIndex }: Props) {
  return (
    <View className="w-full gap-1">
      <View className="w-full flex-row items-start justify-between">
        {stages.map((stage, index) => {
          if (index === activeIndex) {
            return (
              <View
                key={stage}
                className="items-center justify-center rounded-full bg-primary-500 px-3 py-0.5"
              >
                <Text className="whitespace-nowrap font-pretendard-semibold text-12 font-semibold leading-[18px] text-[#F2F7FC]">
                  {stage}
                </Text>
              </View>
            );
          }
          const isCompleted = index < activeIndex;
          return (
            <View
              key={stage}
              className="items-center justify-center px-3 py-0.5"
            >
              <Text
                className={`whitespace-nowrap font-pretendard-semibold text-12 font-semibold leading-[18px] ${
                  isCompleted ? "text-primary-500" : "text-[#BFC4CC]"
                }`}
              >
                {stage}
              </Text>
            </View>
          );
        })}
      </View>

      <View className="mt-2 w-full flex-row items-center justify-center px-10">
        {stages.map((stage, index) => {
          const isCurrent = index === activeIndex;
          const isCompleted = index < activeIndex;
          const isPassed = isCurrent || isCompleted;
          return (
            <Fragment key={stage}>
              <View
                className={`rounded-full bg-white ${
                  isCurrent ? "h-2.5 w-2.5 border-[3px]" : "h-2 w-2 border-2"
                } ${isPassed ? "border-primary-500" : "border-gray-200"}`}
              />
              {index < stages.length - 1 && (
                <View
                  className={`h-0.5 flex-1 ${
                    index < activeIndex ? "bg-primary-500" : "bg-gray-200"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}
