import "./global.css";

import React from "react";
import { Text, View } from "react-native";

import KakaoLoginButton from "./src/features/auth/components/KakaoLoginButton";

export default function App() {
  console.log("[App] render start (no expo-font)");

  return (
    <View>
      <Text className="text-primary-500">색상 테스트: 파랑이면 tailwind OK</Text>
      <Text className="text-secondary-500">색상 테스트: 분홍이면 tailwind OK</Text>
      <KakaoLoginButton />
    </View>
  );
}
