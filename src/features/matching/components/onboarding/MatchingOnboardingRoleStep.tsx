import React from "react";
import { View } from "react-native";

import RoleOptionCard from "./RoleOptionCard";
import type { MatchingRole } from "../../types";

const supporterImage = require("../../../../../assets/images/img_support_pig.png");
const studentImage = require("../../../../../assets/images/img_student_pig.png");

type Props = {
  role: MatchingRole | null;
  onSelectRole: (role: MatchingRole) => void;
};

/**
 * 부메랑 신청 온보딩 - 역할(서포터즈/유학생) 선택 콘텐츠
 * (Figma node 1883:31414 미선택, 1883:31435 "집 구하는 유학생" 선택 상태).
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당하고, 이 컴포넌트는
 * 가운데 콘텐츠만 담당한다 (MatchingOnboardingScreen이 셸 안에 끼워 넣음).
 */
export default function MatchingOnboardingRoleStep({
  role,
  onSelectRole,
}: Props) {
  return (
    <View className="w-full gap-4 px-4 pt-28">
      <RoleOptionCard
        title="서포터즈"
        description="유학생과 함께 부동산을 방문해요."
        image={supporterImage}
        selected={role === "supporter"}
        onPress={() => onSelectRole("supporter")}
      />
      <RoleOptionCard
        title="집 구하는 유학생"
        description="한국에서 집을 구하고 있어요."
        image={studentImage}
        selected={role === "student"}
        onPress={() => onSelectRole("student")}
      />
    </View>
  );
}
