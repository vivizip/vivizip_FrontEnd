import React from "react";
import { TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

/**
 * 입주 기록 이름 입력 필드 (Figma node 1064:9787)
 * - placeholder/underline: gray-600, border-bottom 1px
 */
export default function RecordNameInput({ value, onChangeText }: Props) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="새로운 이름을 지어주세요"
      placeholderTextColor="#626975"
      className="w-full border-b border-gray-600 pb-3 font-pretendard-medium font-medium text-16 leading-6 text-gray-600"
    />
  );
}
