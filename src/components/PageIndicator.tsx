import React from "react";
import { View } from "react-native";

type Props = {
  count: number;
  activeIndex: number;
};

const FRAME_SIZE = 42;
const DOT_SIZE = 8;

/**
 * 페이지 인디케이터 공통 컴포넌트 (Figma "icon_Page Indicator", node 1705:28579)
 * - 프레임: width/height 42px, rotate(90deg) - Figma 아이콘 컴포넌트 규격 그대로
 * - 점: active는 Primary Color/Blue/400(#59A0F8), non-active는 Gray Scale/100(#E7E9EC)
 * - 프레임 사이 간격 4px
 */
export default function PageIndicator({ count, activeIndex }: Props) {
  return (
    <View className="flex-row items-center" style={{ gap: 4 }}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          className="items-center justify-center"
          style={{
            height: FRAME_SIZE,
            transform: [{ rotate: "90deg" }],
          }}
        >
          <View
            className="rounded-full"
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              backgroundColor: index === activeIndex ? "#59A0F8" : "#E7E9EC",
            }}
          />
        </View>
      ))}
    </View>
  );
}
