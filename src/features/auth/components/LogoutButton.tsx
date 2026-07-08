import React from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { clearTokens, getRefreshToken } from "../../../lib/tokenStorage";
import { logout } from "../services/authApi";

/**
 * 로그아웃 버튼.
 * TODO(디자인 미정): Figma 스펙 나오기 전까지 임시 스타일. 스펙 확정되면 교체할 것.
 */
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (err) {
        // 서버 로그아웃 실패해도 로컬 토큰은 지워서 기기에서는 로그아웃 상태로 만든다
        console.log("[Logout] Server logout failed:", String(err));
      }
    }
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
