import React from "react";
import { Image, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";

import { useKakaoLogin } from "../hooks/useKakaoLogin";
import { getCachedProfile } from "../hooks/useMyProfile";
import { hasSeenOnboarding } from "../../onboarding/lib/onboardingStorage";

const kakaoLogo = require("../../../../assets/icons/kakao_logo.png");

/**
 * 카카오 로그인 버튼 (Figma 스펙)
 * - height 54, padding 10, gap 8, radius 8px, bg #FAE100(카카오 옐로)
 * - 라벨: Pretendard 16px 600, line-height 24, letter-spacing -0.16, #3B1D1D
 */
export default function KakaoLoginButton() {
  const router = useRouter();
  const { signInWithKakao, isLoading } = useKakaoLogin();

  const handlePress = async () => {
    const result = await signInWithKakao();
    if (result) {
      // 로그인 화면으로 뒤로가기할 수 없도록 replace로 이동
      // (온보딩을 아직 안 봤으면 온보딩으로, 봤으면 바로 홈 탭으로) - 계정별로 판단한다
      const userId = getCachedProfile()?.id ?? null;
      const seen = await hasSeenOnboarding(userId);
      router.replace(seen ? "/home" : "/onboarding");
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className={`h-[54px] flex-row items-center justify-center gap-2 self-stretch rounded-lg bg-[#FAE100] p-[10px] ${
        isLoading ? "opacity-50" : "active:opacity-80"
      }`}
      accessibilityRole="button"
      accessibilityLabel="카카오톡으로 로그인하기"
    >
      <Image source={kakaoLogo} className="h-6 w-6" resizeMode="contain" />
      <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-[#3B1D1D]">
        카카오톡으로 로그인하기
      </Text>
    </Pressable>
  );
}
