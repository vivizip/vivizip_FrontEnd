import React from "react";
import { Text, View } from "react-native";

import Toggle from "../../../components/Toggle";

type Props = {
  pushEnabled: boolean;
  onChangePushEnabled: (value: boolean) => void;
};

/**
 * 마이페이지 "계정 및 알림설정" 섹션 (Figma node 1705:18268).
 * 계정 정보 행은 카카오 로그인 여부만 표시(TODO: 다른 로그인 수단 추가 시 값 분기 필요).
 * PUSH 알림 설정만 실제로 토글 상태를 관리한다 (TODO: 서버 저장/실제 푸시 연동 미구현).
 */
export default function AccountSettingsSection({
  pushEnabled,
  onChangePushEnabled,
}: Props) {
  return (
    <View className="w-full items-start gap-0">
      <View className="w-full items-start py-3">
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
          계정 및 알림설정
        </Text>
      </View>
      <View className="w-full gap-3">
        <View className="h-14 w-full justify-center rounded-2xl bg-[#FAFAFD] px-4 py-3">
          <View className="w-full flex-row items-center justify-between">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              계정 정보
            </Text>
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              카카오 로그인
            </Text>
          </View>
        </View>
        <View className="w-full flex-row items-center justify-between rounded-2xl bg-[#FAFAFD] px-4 py-3">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
            PUSH 알림 설정
          </Text>
          <Toggle value={pushEnabled} onValueChange={onChangePushEnabled} />
        </View>
      </View>
    </View>
  );
}
