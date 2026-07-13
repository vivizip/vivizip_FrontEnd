import React from "react";
import { Image, Pressable, TextInput } from "react-native";

const searchIcon = require("../../../../../assets/icons/iconoir_search.png");

type Props = {
  /** 넘기면 인풋이 아니라 이 화면(터치로 주소 검색 페이지 이동)처럼 동작한다 */
  onPress?: () => void;
};

/**
 * 집 주소 검색 인풋.
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정.
 */
export default function AddressSearchBar({ onPress }: Props) {
  return (
    // Figma: padding 8px 12px, space-between, items center, self stretch, radius 16px, bg #FFF
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between self-stretch rounded-2xl bg-white px-3 py-2"
    >
      <TextInput
        // onPress가 있으면 실제 입력 대신 터치로 검색 페이지 이동 (터치가 TextInput에 먹히지 않게 처리)
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
        // p-0: Android TextInput의 기본 상하 패딩 제거 (컨테이너 패딩이 높이를 결정하도록)
        // Figma: Label-m (Pretendard 14/500, lh 20), placeholder gray-400
        className="flex-1 p-0 font-pretendard-medium text-14 font-medium leading-5 text-gray-900"
        placeholder="계약하려는 집 주소를 검색하세요"
        placeholderTextColor="#9FA5AF" // gray-400
        returnKeyType="search"
      />
      <Image
        source={searchIcon}
        className="h-6 w-6"
        resizeMode="contain"
        style={{ tintColor: "#9FA5AF" }}
      />
    </Pressable>
  );
}
