import React from "react";
import { Image, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { useKakaoLogin } from "../hooks/useKakaoLogin";

const kakaoLoginImage = require("../../../../assets/images/kakao_login_large_narrow_ko.png");

export default function KakaoLoginButton() {
  const router = useRouter();
  const { signInWithKakao, isLoading } = useKakaoLogin();

  const handlePress = async () => {
    const result = await signInWithKakao();
    if (result) {
      // 로그인 화면으로 뒤로가기할 수 없도록 replace로 홈 탭 이동
      router.replace("/home");
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className={isLoading ? "opacity-50" : "active:opacity-70"}
    >
      <Image source={kakaoLoginImage} resizeMode="contain" />
    </Pressable>
  );
}
