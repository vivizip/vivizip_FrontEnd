import React from "react";
import { SafeAreaView, Text, View } from "react-native";

type Props = {
  title: string;
};

// 아직 구현 전인 화면의 임시 표시용 공용 컴포넌트
export default function PlaceholderScreen({ title }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="text-title-l text-gray-800">{title}</Text>
        <Text className="text-body-s text-gray-500">준비 중인 기능입니다</Text>
      </View>
    </SafeAreaView>
  );
}
