import React from "react";
import { Image, Text, View } from "react-native";

import { TOPBAR_EXTRA_TOP } from "../../../lib/layout";

const notificationOffIcon = require("../../../../assets/icons/ic_noti_off.png");

// TODO(알림 백엔드 미구현): 안 읽은 알림 존재 여부를 조회할 방법이 없어 목업으로 표시.
const HAS_UNREAD_NOTIFICATION = false;

/**
 * 홈 화면 상단 바 (Figma node 1915:33484) - 로고 + 알림 아이콘.
 * TopBar와 동일한 여백(px-4 pb-3, top에 TOPBAR_EXTRA_TOP 추가)을 써서 레이아웃 크기를 맞춤.
 * 알림 아이콘은 항상 ic_noti_off 하나만 쓰고, 안 읽은 알림이 있을 때만 우상단에 빨간 점
 * 배지를 코드로 얹는다(ic_noti_on 이미지 통째 교체 대신 - 배지 위치/색을 유연하게 바꿀 수 있음).
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
      <View className="h-6 w-6">
        <Image
          source={notificationOffIcon}
          className="h-6 w-6"
          resizeMode="contain"
        />
        {HAS_UNREAD_NOTIFICATION && (
          <View className="absolute right-[-1] top-[-3] h-2 w-2 rounded-full bg-secondary-500" />
        )}
      </View>
    </View>
  );
}
