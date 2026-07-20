import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  onPressWithdraw: () => void;
};

/**
 * 마이페이지 하단 링크 (Figma node 1705:18281, "회원탈퇴 | 서비스 약관").
 * 회원탈퇴는 DELETE /api/users/me와 연결됨(호출부에서 확인 팝업 처리).
 * TODO(서비스 약관 화면 미구현): 아직 이동할 화면이 없어 텍스트만 표시한다.
 */
export default function MyPageFooterLinks({ onPressWithdraw }: Props) {
  return (
    <View className="w-full flex-row items-center justify-center gap-3">
      <Pressable onPress={onPressWithdraw} accessibilityRole="button">
        <Text className="font-pretendard text-14 text-[rgba(0,0,0,0.4)]">
          회원탈퇴
        </Text>
      </Pressable>
      <View className="h-3 w-px bg-[rgba(0,0,0,0.4)]" />
      <Text className="font-pretendard text-14 text-[rgba(0,0,0,0.4)]">
        서비스 약관
      </Text>
    </View>
  );
}
