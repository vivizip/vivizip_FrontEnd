import React from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

/**
 * 비회원 둘러보기 버튼 (Figma 스펙)
 * - height 54, padding 10, gap 10, radius 8px, bg #EFEFEF
 */
export default function NonMemberButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.replace("/home")}
      className="h-[54px] flex-row items-center justify-center gap-2.5 self-stretch rounded-lg bg-[#EFEFEF] p-[10px] active:opacity-80"
      accessibilityRole="button"
      accessibilityLabel="비회원으로 둘러보기"
    >
      <Text className="font-pretendard text-16 font-semibold leading-6 tracking-[-0.16px] text-[#3B1D1D]">
        비회원으로 둘러보기
      </Text>
    </Pressable>
  );
}
