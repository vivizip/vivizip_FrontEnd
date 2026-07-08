import React from "react";
import { SafeAreaView, View } from "react-native";

import AndroidKeyHashDebug from "../../features/auth/components/AndroidKeyHashDebug";
import KakaoLoginButton from "../../features/auth/components/KakaoLoginButton";
import LoginTitle from "../../features/auth/components/LoginTitle";
import NonMemberButton from "../../features/auth/components/NonMemberButton";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-between px-6 pb-[76px] pt-[160px]">
        <LoginTitle />
        <View className="w-full items-center gap-3">
          <KakaoLoginButton />
          <NonMemberButton />
          {/* <AndroidKeyHashDebug /> */}
        </View>
      </View>
    </SafeAreaView>
  );
}
