import React from "react";
import { Text, View } from "react-native";

/**
 * 마이페이지 하단 링크 (Figma node 1705:18281, "회원탈퇴 | 서비스 약관").
 * TODO(회원탈퇴/서비스 약관 화면 미구현): 아직 이동할 화면이 없어 텍스트만 표시한다.
 */
export default function MyPageFooterLinks() {
  return (
    <View className="w-full flex-row items-center justify-center gap-3">
      <Text className="font-pretendard text-14 text-[rgba(0,0,0,0.4)]">
        회원탈퇴
      </Text>
      <View className="h-3 w-px bg-[rgba(0,0,0,0.4)]" />
      <Text className="font-pretendard text-14 text-[rgba(0,0,0,0.4)]">
        서비스 약관
      </Text>
    </View>
  );
}
