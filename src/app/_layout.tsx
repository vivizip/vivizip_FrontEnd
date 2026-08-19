import "react-native-gesture-handler";
import "../../global.css";

import React, { useEffect } from "react";
import { AppState } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Toast from "../components/Toast";
import { getRefreshToken } from "../lib/tokenStorage";
import { refreshTokens } from "../lib/api";
import { queryClient } from "../lib/queryClient";

const TOKEN_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export default function RootLayout() {
  useEffect(() => {
    let isMounted = true;

    const refreshIfSignedIn = async () => {
      const refreshToken = await getRefreshToken();
      if (isMounted && refreshToken) {
        await refreshTokens();
      }
    };

    // 앱 재진입 시 즉시 확인하고, 활성 상태에서는 주기적으로 최신 토큰을 받는다.
    refreshIfSignedIn();
    const intervalId = setInterval(refreshIfSignedIn, TOKEN_REFRESH_INTERVAL_MS);
    const appStateSubscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          refreshIfSignedIn();
        }
      },
    );

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, []);

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
