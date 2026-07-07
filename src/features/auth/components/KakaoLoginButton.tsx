import React from "react";
import { Image, Pressable } from "react-native";

import { useKakaoLogin } from "../hooks/useKakaoLogin";

const kakaoLoginImage = require("../../../../assets/images/kakao_login_large_narrow_ko.png");

export default function KakaoLoginButton() {
  const { signInWithKakao, isLoading } = useKakaoLogin();

  return (
    <Pressable
      onPress={signInWithKakao}
      disabled={isLoading}
      className={isLoading ? "opacity-50" : "active:opacity-70"}
    >
      <Image source={kakaoLoginImage} resizeMode="contain" />
    </Pressable>
  );
}
