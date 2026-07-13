import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useRegisteredHouseStore } from "../../store/useRegisteredHouseStore";

/**
 * 등록된 집 선택 드롭다운.
 * 집 미등록 시 "등록된 집이 없어요" + opacity 40%(터치 비활성),
 * 등록되면 주소 + opacity 100% + 터치 시 등록 주소 목록 화면으로 이동.
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정.
 */
export default function HouseSelector() {
  const router = useRouter();
  const address = useRegisteredHouseStore((state) => state.address);
  const hasHouse = address !== null;

  return (
    <Pressable
      onPress={hasHouse ? () => router.push("/ai-reviewer/houses") : undefined}
      disabled={!hasHouse}
      className={`flex-row items-center gap-1 active:opacity-70 ${
        hasHouse ? "opacity-100" : "opacity-40"
      }`}
      accessibilityRole="button"
      accessibilityLabel="등록된 집 선택"
    >
      {/* Figma: Title-m (Pretendard 18/600, lh 26), gray-900, 한 줄 말줄임 */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900"
      >
        {hasHouse ? address : "등록된 집이 없어요"}
      </Text>
      <Ionicons name="caret-down" size={16} color="#121619" />
    </Pressable>
  );
}
