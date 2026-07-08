import React from "react";
import { Text, View } from "react-native";

export default function LoginTitle() {
  return (
    // 가로 여백은 부모(login.tsx px-6)가 담당 → 버튼과 동일한 기준선에 정렬
    <View className="w-full flex-col items-start gap-2">
      <Text className="text-[36px] font-bold text-[#0F40AB]">VIVIZIP</Text>
      <Text className="text-base font-medium text-gray-500">
        외국인 유학생의 안전한 집 구하기
      </Text>
    </View>
  );
}
