import React from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * 등록된 집 선택 드롭다운.
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정. 집 등록/선택 기능은 추후 연결.
 */
export default function HouseSelector() {
  return (
    <Pressable
      className="flex-row items-center gap-1 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel="등록된 집 선택"
    >
      {/* Figma: Title-m (Pretendard 18/600, lh 26), gray-900, 한 줄 말줄임 */}
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        className="font-pretendard text-18 font-semibold leading-[26px] text-gray-900"
      >
        등록된 집이 없어요
      </Text>
      <Ionicons name="caret-down" size={16} color="#121619" />
    </Pressable>
  );
}
