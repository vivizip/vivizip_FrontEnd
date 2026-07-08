import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoutButton from "../../features/auth/components/LogoutButton";

export default function MyPageScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-title-l text-gray-800">마이페이지</Text>
        <Text className="text-body-s text-gray-500">준비 중인 기능입니다</Text>
        {/* 디자인 확정 전까지 임시 위치 - LogoutButton 자체도 임시 스타일 */}
        <LogoutButton />
      </View>
    </SafeAreaView>
  );
}
