import React from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { clearTokens } from "../../../lib/tokenStorage";

/**
 * 로그아웃 버튼.
 * TODO(디자인 미정): Figma 스펙 나오기 전까지 임시 스타일. 스펙 확정되면 교체할 것.
 */
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearTokens();
    router.replace("/login");
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="h-11 items-center justify-center rounded-lg border border-gray-300 px-4 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel="로그아웃"
    >
      <Text className="text-body-m text-gray-700">로그아웃</Text>
    </Pressable>
  );
}
