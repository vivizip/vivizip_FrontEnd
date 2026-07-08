import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// 탭 라우트별 default/select 아이콘 쌍 (assets/icons)
const TAB_ICONS: Record<string, { default: number; select: number }> = {
  home: {
    default: require("../../assets/icons/ic_home_default.png"),
    select: require("../../assets/icons/ic_home_select.png"),
  },
  chat: {
    default: require("../../assets/icons/ic_chat_default.png"),
    select: require("../../assets/icons/ic_chat_select.png"),
  },
  "ai-reviewer": {
    default: require("../../assets/icons/ic_document_default.png"),
    select: require("../../assets/icons/ic_document_select.png"),
  },
  mypage: {
    default: require("../../assets/icons/ic_profile_default.png"),
    select: require("../../assets/icons/ic_profile_select.png"),
  },
};

/**
 * 플로팅 알약형 커스텀 탭바 (Figma 스펙 기반)
 * - 컨테이너: width 328, padding 4, gap 2, radius 100px, bg #FFF
 * - box-shadow는 RN 스타일(shadow*, elevation)로 변환
 */
export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-6 items-center"
    >
      {/* Figma: 328px, padding 4px, gap 2px, radius 100px, bg #FFF, shadow 0 2px 10px 12% */}
      <View
        className="w-[328px] flex-row items-center justify-center gap-0.5 rounded-[100px] bg-white p-1"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 6, // Android는 shadow* 대신 elevation 사용
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const focused = state.index === index;
          const icons = TAB_ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name as never);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              // Figma: 78px 고정폭, padding 6px 12px, gap 2px, radius 500px, 선택된 탭에 gray-100 배경 유지
              className={`w-[78px] shrink-0 flex-col items-center gap-0.5 rounded-[500px] px-3 py-1.5 ${
                focused ? "bg-gray-100" : "active:bg-gray-100"
              }`}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
            >
              {/* 아이콘 24x24 고정, 선택 상태에 따라 default/select 이미지 교체 */}
              {icons && (
                <Image
                  source={focused ? icons.select : icons.default}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
              )}
              {/* Figma: Pretendard 12px 500, gray-900(#121619), line-height normal */}
              <Text className="text-center font-pretendard text-12 font-medium text-gray-900">
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
