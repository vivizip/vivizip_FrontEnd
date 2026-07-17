import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import CheckIcon from "../../../../assets/icons/icon_check.svg";

type Props = {
  label: string;
  image: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
};

/**
 * 성별 선택 카드 (Figma node 1883:31732/31735, 선택 시 1883:31754 상태).
 * 세로 배치(이미지 위 - 라벨 아래), 선택 시 배경 primary-100 + 체크 아이콘.
 */
export default function GenderOptionCard({
  label,
  image,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-[170px] flex-1 items-center justify-center gap-4 rounded-lg border px-8 py-5  active:opacity-80 ${
        selected
          ? "border-transparent bg-primary-100"
          : "border-gray-200 bg-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
    >
      <Image
        source={image}
        style={{ width: 52, height: 83 }}
        resizeMode="contain"
      />
      <View className="flex-row items-center gap-1">
        {selected && <CheckIcon width={24} height={24} color="#2C74F2" />}
        <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
