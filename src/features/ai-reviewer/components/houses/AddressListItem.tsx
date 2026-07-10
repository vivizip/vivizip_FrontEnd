import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import Badge from "../../../../components/Badge";

const locationIcon = require("../../../../../assets/icons/ic_location_filled.png");
const kebabIcon = require("../../../../../assets/icons/ic_kebab.png");

export type RegisteredAddress = {
  id: string;
  title: string;
  subtitle: string;
  isCurrent: boolean;
};

type Props = {
  address: RegisteredAddress;
  onPress?: () => void;
  onPressKebab?: () => void;
};

/**
 * 등록된 주소 목록 한 줄 (Figma)
 * - ic_location_filled 24x24 + 8px 간격 + 텍스트 블록 + 케밥(48x48 터치영역, 아이콘 24x24)
 * - 타이틀: Title/Title-s(16/600, lh24, ls-0.16), gray-900 - 뱃지와 8px 간격
 * - 타이틀행 ↔ 서브텍스트 4px 간격
 * - 서브텍스트: Label/Label-m(14/500, lh20), gray-600, 한 줄 말줄임
 * - 텍스트 ↔ 케밥 간격은 스펙 미기재, 행 전체 gap(8px)을 그대로 적용
 */
export default function AddressListItem({
  address,
  onPress,
  onPressKebab,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center gap-2 active:opacity-70"
    >
      <Image source={locationIcon} className="h-6 w-6" resizeMode="contain" />

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text
            numberOfLines={1}
            className="font-pretendard text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-900"
          >
            {address.title}
          </Text>
          {address.isCurrent && <Badge label="현재 설정된 주소" />}
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="font-pretendard text-14 font-medium leading-5 text-gray-600"
        >
          {address.subtitle}
        </Text>
      </View>

      <Pressable
        onPress={onPressKebab}
        className="h-12 w-12 items-center justify-center"
        accessibilityRole="button"
        accessibilityLabel="더보기"
      >
        <Image source={kebabIcon} className="h-6 w-6" resizeMode="contain" />
      </Pressable>
    </Pressable>
  );
}
