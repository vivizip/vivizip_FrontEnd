import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "../../features/home/components/HomeHeader";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeHeader />
      {/* 홈 콘텐츠 (배너, 기능 진입 카드 등)는 features/home/components에 추가해서 여기서 조립 */}
      <View className="flex-1" />
    </SafeAreaView>
  );
}
