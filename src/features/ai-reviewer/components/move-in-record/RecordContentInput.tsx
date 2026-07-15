import React from "react";
import { Text, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

/**
 * "기록하고 싶은 내용을 작성해주세요" 멀티라인 입력 섹션 (Figma node 1064:9813)
 */
export default function RecordContentInput({ value, onChangeText }: Props) {
  return (
    <View className="w-full gap-2">
      <Text className="w-full font-pretendard-semibold text-14 leading-[22px] text-gray-800">
        기록하고 싶은 내용을 작성해주세요
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="집 사이즈는 좋은데 벽지가 조금 얼룩덜룩하다. 그리고 화장실 곰팡이가 조금 보여서 관리를 해야할 것 같다."
        placeholderTextColor="#9FA5AF"
        multiline
        textAlignVertical="top"
        className="h-[164px] w-full rounded-2xl bg-gray-100 px-4 py-5 font-pretendard-medium font-medium text-14 leading-[22px] text-gray-700"
      />
    </View>
  );
}
