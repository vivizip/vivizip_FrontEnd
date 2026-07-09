import React from "react";
import { Image, TextInput, View } from "react-native";

const searchIcon = require("../../assets/icons/iconoir_search.png");

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmitEditing?: () => void;
};

/**
 * SearchInput 공통 컴포넌트 (Figma)
 * - 레이아웃: padding 12px 16px, items center, radius 16px, bg gray-50(#F4F5F7)
 * - gap 110px은 328px 고정 프레임에서 남은 공간을 캡처한 값이라, 텍스트 flex-1 + justify-between으로 대체
 * - placeholder: Body/Body-m (Pretendard 16/500, lh 24), gray-500
 * - 아이콘: 24x24, iconoir_search
 */
export default function SearchInput({
  value,
  onChangeText,
  placeholder,
  onSubmitEditing,
}: Props) {
  return (
    <View className="w-full flex-row items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7E8591" // gray-500
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        // p-0: Android TextInput의 기본 상하 패딩 제거 (컨테이너 패딩이 높이를 결정하도록)
        className="flex-1 p-0 font-pretendard text-16 font-medium leading-6 text-gray-900"
      />
      <Image
        source={searchIcon}
        className="h-6 w-6"
        resizeMode="contain"
        style={{ tintColor: "#7E8591" }} // gray-500
      />
    </View>
  );
}
