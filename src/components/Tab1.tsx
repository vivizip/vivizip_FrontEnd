import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  /** 컨테이너 배경 tailwind 클래스 (기본 bg-gray-100 / Figma Tab2는 bg-gray-50) */
  bgClassName?: string;
  /** 활성 탭 텍스트 색상 override (기본 tracking-[-0.16px] text-primary-500) */
  activeTextClassName?: string;
  /** 비활성 탭 텍스트 색상 override (기본 text-gray-900) */
  inactiveTextClassName?: string;
};

/**
 * Tab1 공통 컴포넌트 (Figma Tab1/Tab2 통합) - 세그먼트 탭 스위처
 * - 배경 프레임: width full(Figma 328px = 화면 콘텐츠 폭 캡처값), padding 4px, gap 4px,
 *   radius 12px, bg 기본 gray-100(#E7E9EC) - bgClassName으로 override 가능(예: gray-50)
 * - 탭 아이템: flex-1(Figma 104px = 328/3 균등분할), padding 4px 10px, radius 8px
 *   - 활성: bg #FFF / 비활성: 배경 없음(컨테이너 배경이 그대로 비침)
 * - 텍스트: 비활성 Label/Label-l(16/600, lh24) gray-900,
 *   활성 Title/Title-s(16/600, lh24, ls -0.16px) primary-500(#2C74F2)
 *   - 다른 화면(예: 등기부등본 확인)에서는 색상이 달라 activeTextClassName/inactiveTextClassName로 override
 */
export default function Tab1({
  tabs,
  activeIndex,
  onChange,
  bgClassName,
  activeTextClassName,
  inactiveTextClassName,
}: Props) {
  return (
    <View
      className={`w-full flex-row items-center gap-1 rounded-xl p-1 ${
        bgClassName ?? "bg-gray-100"
      }`}
    >
      {tabs.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(index)}
            className={`flex-1 shrink-0 items-center justify-center rounded-lg px-2.5 py-1 ${
              isActive ? "bg-white" : ""
            }`}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              className={`font-pretendard-semibold text-16 font-semibold leading-6 ${
                isActive
                  ? (activeTextClassName ?? "tracking-[-0.16px] text-primary-500")
                  : (inactiveTextClassName ?? "text-gray-900")
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
