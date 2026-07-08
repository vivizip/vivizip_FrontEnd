import React from "react";
import { Pressable, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

// 디자인 시스템 색상 (tailwind.config.js와 동일 값)
const ACTIVE_TINT = "#2C74F2"; // primary-500
const INACTIVE_TINT = "#9FA5AF"; // gray-400

/**
 * 플로팅 알약형 커스텀 탭바 (Figma 스펙 기반)
 * - width 350, padding 10px 0, gap 8, radius 100px, bg white 70%
 * - box-shadow는 RN 스타일(shadow*, elevation)로 변환
 * - backdrop-filter(blur)는 RN 미지원이라 반투명 배경으로 근사
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
      <View
        className="w-[350px] flex-row items-center justify-center gap-2 rounded-[100px] bg-white/70 py-[10px]"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 6, // Android는 shadow* 대신 elevation 사용
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const focused = state.index === index;
          const color = focused ? ACTIVE_TINT : INACTIVE_TINT;

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
              {/* 아이콘 24x24 고정 */}
              {options.tabBarIcon?.({ focused, color, size: 24 })}
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
