import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

import { useToastStore } from "../store/useToastStore";
import CheckIcon from "../../assets/icons/icon_check.svg";

const TOAST_DURATION = 2500;
const FADE_DURATION = 200;

/**
 * 앱 전역 토스트 (Figma node 2487:12581, "toast" - "재매칭 신청이 완료되었어요" 예시).
 * useToastStore.show(message)로 어디서든 띄울 수 있고, 일정 시간 후 자동으로 사라진다.
 * ic_check_toast 아이콘은 Figma 에셋 다운로드가 placeholder만 내려받아져서, 기존
 * icon_check.svg(currentColor 지원)를 초록 원 배경 위에 흰색으로 얹어 대체했다.
 */
export default function Toast() {
  const message = useToastStore((state) => state.message);
  const hide = useToastStore((state) => state.hide);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }).start(() => hide());
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [message, opacity, hide]);

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 90,
        opacity,
      }}
    >
      <View className="w-full flex-row items-center gap-3 rounded-xl bg-gray-600 px-5 py-2.5 mb-[52px]">
        <View className="h-6 w-6 items-center justify-center rounded-full bg-[#34C759]">
          <CheckIcon width={14} height={14} color="#FFFFFF" />
        </View>
        <Text className="flex-1 font-pretendard text-16 leading-6 tracking-[0.16px] text-white">
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
