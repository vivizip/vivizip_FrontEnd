import React, { useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export type WheelPickerItem<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  items: WheelPickerItem<T>[];
  value: T;
  onChange: (value: T) => void;
  /** 한 행의 높이(px). 기본 44 */
  itemHeight?: number;
  /** 한 번에 보이는 행 수(홀수 권장 - 가운데 줄이 선택 항목). 기본 5 */
  visibleRows?: number;
};

/**
 * iOS 스타일 스크롤 휠 피커 공용 컴포넌트 (마이페이지 언어 선택, 부메랑 온보딩 국적 선택 등에서 재사용).
 * 선택 항목과의 거리로 글자 크기(18/16/14)·색(gray-800/500/300)을 달리하고, 가운데 줄에는
 * 고정 하이라이트 배경(gray-100)을 깔아 현재 선택 위치를 표시한다. 위/아래로 visibleRows//2줄만큼
 * 여백을 둬서 첫/마지막 항목도 가운데까지 스크롤될 수 있게 한다. 탭으로도 바로 선택 가능하다.
 */
export default function WheelPicker<T extends string>({
  items,
  value,
  onChange,
  itemHeight = 44,
  visibleRows = 5,
}: Props<T>) {
  const paddingRows = Math.floor(visibleRows / 2);
  const wheelHeight = itemHeight * visibleRows;
  const initialIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  const commitIndex = (index: number) => {
    setSelectedIndex(index);
    onChange(items[index].value);
  };

  const scrollToIndex = (index: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const rawIndex = Math.round(
      event.nativeEvent.contentOffset.y / itemHeight,
    );
    const clampedIndex = Math.max(0, Math.min(items.length - 1, rawIndex));
    commitIndex(clampedIndex);
  };

  const handlePressItem = (index: number) => {
    scrollToIndex(index);
    commitIndex(index);
  };

  return (
    <View style={{ height: wheelHeight }} className="w-full items-center">
      <View
        pointerEvents="none"
        className="absolute w-full rounded-xl bg-gray-100"
        style={{ height: itemHeight, top: itemHeight * paddingRows }}
      />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        contentOffset={{ x: 0, y: initialIndex * itemHeight }}
        contentContainerStyle={{ paddingVertical: itemHeight * paddingRows }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      >
        {items.map((item, index) => {
          const distance = Math.abs(index - selectedIndex);
          const textSizeClass =
            distance === 0
              ? "text-18"
              : distance === 1
                ? "text-16"
                : "text-14";
          const textColorClass =
            distance === 0
              ? "text-gray-800"
              : distance === 1
                ? "text-gray-500"
                : "text-gray-300";

          return (
            <Pressable
              key={item.value}
              onPress={() => handlePressItem(index)}
              style={{ height: itemHeight }}
              className="w-full items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: distance === 0 }}
            >
              <Text
                className={`font-pretendard-semibold font-semibold ${textSizeClass} ${textColorClass}`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
