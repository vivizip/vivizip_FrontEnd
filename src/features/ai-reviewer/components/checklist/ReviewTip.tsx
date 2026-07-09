import React from "react";
import { Image, Text, View } from "react-native";

const tipImage = require("../../../../../assets/images/img_ai_document.png");

/**
 * 주소 검색 안내 팁 + 문서 일러스트.
 * TODO(눈대중 구현): Figma 스펙으로 보정 예정.
 */
export default function ReviewTip() {
  return (
    // items-start: 이미지와 텍스트를 상단 기준 정렬
    <View className="flex-row items-start justify-between gap-3">
      <Text className="flex-1 font-pretendard text-12 leading-5 text-white">
        Tip. 주소를 입력하면 등기부등본과 건축물대장을{"\n"}바로 확인할 수
        있어요
      </Text>
      <Image source={tipImage} className="h-16 w-16" resizeMode="contain" />
    </View>
  );
}
