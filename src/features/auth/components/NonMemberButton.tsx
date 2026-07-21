import React from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { hasSeenOnboarding } from "../../onboarding/lib/onboardingStorage";

/**
 * 비회원 둘러보기 버튼 (Figma 스펙)
 * - height 54, padding 10, gap 10, radius 8px, bg #EFEFEF
 */
export default function NonMemberButton() {
  const router = useRouter();

  const handlePress = async () => {
    // 비회원 진입은 로그인 계정이 없어 게스트 전용 키를 쓴다
    const seen = await hasSeenOnboarding(null);
    router.replace(seen ? "/home" : "/onboarding");
  };

  return (
    <Pressable
      onPress={handlePress}
      className="h-[54px] flex-row items-center justify-center gap-2.5 self-stretch rounded-lg bg-[#EFEFEF] p-[10px] active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel="비회원으로 둘러보기"
    >
      <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-[#3B1D1D]">
        비회원으로 둘러보기
      </Text>
    </Pressable>
  );
}
