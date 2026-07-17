import React from "react";
import { View } from "react-native";

type Props = {
  /** 0~1 사이 진행률 */
  progress: number;
};

/**
 * 부메랑 신청 온보딩 상단 진행률 바 (Figma node 1879:30502 등, "progress_bar").
 */
export default function MatchingOnboardingProgressBar({ progress }: Props) {
  return (
    <View className="w-full px-4 py-1">
      <View className="h-1 w-full overflow-hidden rounded-lg bg-primary-100">
        <View
          className="h-full rounded-lg bg-primary-500"
          style={{ width: `${progress * 100}%` }}
        />
      </View>
    </View>
  );
}
