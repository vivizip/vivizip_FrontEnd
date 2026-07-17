import React from "react";
import { Text, View } from "react-native";

import NotificationIcon from "../../../../assets/icons/icon_notifi.svg";
import { TOPBAR_EXTRA_TOP } from "../../../lib/layout";

/**
 * 홈 화면 상단 바 (Figma node 1915:33484) - 로고 + 알림 아이콘.
 * TopBar와 동일한 여백(px-4 pb-3, top에 TOPBAR_EXTRA_TOP 추가)을 써서 레이아웃 크기를 맞춤.
 * TODO(알림 미구현): 아이콘은 정적 표시만 하고 별도 화면/onPress는 없음.
 */
export default function HomeHeader() {
  return (
    <View
      className="w-full flex-row items-center justify-between px-4 pb-3"
      style={{ paddingTop: 12 + TOPBAR_EXTRA_TOP }}
    >
      <Text className="font-pretendard-bold text-22 font-bold leading-[30px] text-primary-700">
        VIVIZIP
      </Text>
      <NotificationIcon width={21} height={28} />
    </View>
  );
}
