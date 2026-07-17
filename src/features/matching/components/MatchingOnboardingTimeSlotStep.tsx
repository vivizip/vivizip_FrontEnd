import React from "react";
import { Pressable, Text, View } from "react-native";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;
const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

const PERIODS = [
  { key: "morning", label: "오전", range: "(8-11시)" },
  { key: "afternoon", label: "오후", range: "(12-17시)" },
  { key: "evening", label: "저녁", range: "(18-21시)" },
] as const;

/** "요일-시간대" 형태의 셀 키 (예: "sun-morning") */
export const buildTimeSlotKey = (
  dayKey: (typeof DAY_KEYS)[number],
  periodKey: (typeof PERIODS)[number]["key"],
) => `${dayKey}-${periodKey}`;

type Props = {
  selected: Set<string>;
  onToggle: (key: string) => void;
};

/**
 * 부메랑 신청 온보딩(서포터즈) - 활동 가능 시간대 선택 콘텐츠
 * (Figma node 1883:31244 미선택, 1883:31182 일부 선택 상태).
 * 요일×시간대 21칸을 터치로 개별 토글한다.
 */
export default function MatchingOnboardingTimeSlotStep({
  selected,
  onToggle,
}: Props) {
  return (
    <View className="w-full items-center px-4 pt-16">
      <View className="flex-row items-end justify-center gap-2">
        <View className="gap-1">
          {PERIODS.map((period) => (
            <View
              key={period.key}
              className="h-[88px] w-[52px] items-center justify-center gap-0.5"
            >
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-700">
                {period.label}
              </Text>
              <Text className="font-pretendard text-12 leading-4 text-gray-500">
                {period.range}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-1">
          <View className="flex-row items-center gap-1">
            {DAY_LABELS.map((day) => (
              <Text
                key={day}
                className="w-[34px] text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800"
              >
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row items-center gap-1">
            {DAY_KEYS.map((dayKey, dayIndex) => (
              <View key={dayKey} className="w-[34px] gap-1">
                {PERIODS.map((period) => {
                  const cellKey = buildTimeSlotKey(dayKey, period.key);
                  const isSelected = selected.has(cellKey);
                  return (
                    <Pressable
                      key={cellKey}
                      onPress={() => onToggle(cellKey)}
                      className={`h-[88px] w-full rounded-sm ${
                        isSelected ? "bg-primary-400" : "bg-gray-100"
                      }`}
                      accessibilityRole="button"
                      accessibilityLabel={`${DAY_LABELS[dayIndex]} ${period.label}`}
                      accessibilityState={{ selected: isSelected }}
                    />
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
