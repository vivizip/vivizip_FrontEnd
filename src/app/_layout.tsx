import "react-native-gesture-handler";
import "../../global.css";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Toast from "../components/Toast";

// 앱 전체에서 하나의 QueryClient 인스턴스를 공유한다 (리렌더 시 재생성 방지를 위해 모듈 스코프에 선언)
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
