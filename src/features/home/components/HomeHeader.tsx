import React from "react";
import { Text, View } from "react-native";

export default function HomeHeader() {
  return (
    <View className="gap-1 px-6 pt-4">
      <Text className="text-headline-m text-primary-700">VIVIZIP</Text>
      <Text className="text-body-m text-gray-500">
        외국인 유학생의 안전한 집 구하기
      </Text>
    </View>
  );
}
