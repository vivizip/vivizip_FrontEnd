import React from "react";
import { Text, View } from "react-native";

import Badge from "../../../../components/Badge";

type Props = {
  badgeLabel: string;
  variant?: "primary" | "danger";
  children: React.ReactNode;
};

/**
 * 신고 방법 카드 내부의 라벨(뱃지) + 설명 한 줄 (Figma node 1588:20897 등)
 * - variant "danger"는 주의사항 행 (secondary 톤), 기본은 primary 톤
 */
export default function ReportInfoRow({
  badgeLabel,
  variant = "primary",
  children,
}: Props) {
  return (
    <View className="w-full flex-row items-start gap-2">
      <View>
        <Badge
          label={badgeLabel}
          bgClassName={variant === "danger" ? "bg-secondary-50" : "bg-primary-50"}
          textClassName={variant === "danger" ? "text-secondary-400" : "text-primary-500"}
        />
      </View>
      <Text className="flex-1 font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-800">
        {children}
      </Text>
    </View>
  );
}
