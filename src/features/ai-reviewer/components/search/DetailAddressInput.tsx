import React from "react";
import { TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

/**
 * 상세 주소 입력 필드 (Figma)
 * - placeholder: Body/Body-m (Pretendard 16/500, lh 24), gray-300
 * - 입력된 텍스트: 동일 스타일, 색만 gray-600
 * - border-bottom 1px gray-300
 */
export default function DetailAddressInput({ value, onChangeText }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="상세 주소를 입력해주세요"
      placeholderTextColor="#BFC4CC" // gray-300
      className="border-b border-gray-300 pb-2 font-pretendard-medium text-16 font-medium leading-6 text-gray-600"
    />
  );
}
