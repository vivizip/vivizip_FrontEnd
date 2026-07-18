import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import CheckIcon from "../../../../../assets/icons/icon_check.svg";

type Props = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  selected: boolean;
  onPress: () => void;
};

/**
 * 부메랑 신청 온보딩의 역할 선택 카드 (Figma node 1883:31421/31427, 선택 시 1883:31448 상태).
 * 선택 시 배경이 primary-100으로 바뀌고 제목 옆에 체크 아이콘이 붙는다.
 */
export default function RoleOptionCard({
  title,
  description,
  image,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-full flex-row items-center gap-4 rounded-lg border p-5 active:opacity-80 ${
        selected ? "border-transparent bg-primary-100" : "border-gray-100 bg-white"
      }`}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
    >
      <Image source={image} style={{ width: 80, height: 80 }} resizeMode="contain" />
      <View className="gap-0.5">
        <View className="flex-row items-center gap-1">
          <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
            {title}
          </Text>
          {selected && <CheckIcon width={24} height={24} color="#2C74F2" />}
        </View>
        <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-500">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
