import React, { useRef, useState } from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import CTAButton from "../../../components/CTAButton";

export type LanguageOption = "korea" | "vietnam" | "china";

const LANGUAGE_ITEMS: { value: LanguageOption; label: string }[] = [
  { value: "korea", label: "한국" },
  { value: "vietnam", label: "베트남" },
  { value: "china", label: "중국" },
];

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PADDING_ROWS = Math.floor(VISIBLE_ROWS / 2);
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

type Props = {
  value: LanguageOption;
  onConfirm: (value: LanguageOption) => void;
};

/**
 * 마이페이지 "내 정보" KR 칩을 누르면 뜨는 언어 선택 바텀시트 (Figma node 1413:17956, "언어 선택").
 * iOS 휠 피커처럼 스크롤로 가운데 항목을 고른다 - 선택 항목과의 거리로 글자 크기/색을 달리하고,
 * 가운데 줄에는 고정된 하이라이트 배경(gray-100)을 깔아 현재 선택 위치를 표시한다.
 * 위/아래로 2줄씩 여백(PADDING_ROWS)을 둬서 첫/마지막 항목도 가운데까지 스크롤될 수 있게 한다.
 */
export default function LanguageSelectSheet({ value, onConfirm }: Props) {
  const initialIndex = Math.max(
    0,
    LANGUAGE_ITEMS.findIndex((item) => item.value === value),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToIndex = (index: number, animated = true) => {
    scrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const rawIndex = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clampedIndex = Math.max(
      0,
      Math.min(LANGUAGE_ITEMS.length - 1, rawIndex),
    );
    setSelectedIndex(clampedIndex);
  };

  const handlePressItem = (index: number) => {
    setSelectedIndex(index);
    scrollToIndex(index);
  };

  return (
    <View className="w-full items-center gap-2">
      <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-500">
        언어를 선택해 주세요
      </Text>

      <View style={{ height: WHEEL_HEIGHT }} className="w-full items-center">
        <View
          pointerEvents="none"
          className="absolute w-full rounded-xl bg-gray-100"
          style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT * PADDING_ROWS }}
        />
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentOffset={{ x: 0, y: initialIndex * ITEM_HEIGHT }}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * PADDING_ROWS,
          }}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {LANGUAGE_ITEMS.map((item, index) => {
            const distance = Math.abs(index - selectedIndex);
            const textSizeClass =
              distance === 0 ? "text-18" : distance === 1 ? "text-16" : "text-14";
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
                style={{ height: ITEM_HEIGHT }}
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

      <View className="w-full pt-4">
        <CTAButton
          label="입력 완료"
          active
          onPress={() => onConfirm(LANGUAGE_ITEMS[selectedIndex].value)}
        />
      </View>
    </View>
  );
}
