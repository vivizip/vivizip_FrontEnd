import React from "react";
import { Text, View } from "react-native";

type FeatureCard = {
  title: string;
  description: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "부동산 메이트랑 함께 , 부메랑",
    description:
      "함께 부동산에 동행해서 중개인과 의사소통을 도와줄 집구하기 서포터즈와 1:1 매칭",
  },
  {
    title: "AI 서류분석 시스템으로 안전하게!",
    description:
      "서류를 촬영해보세요 어떤 의미인지, 위험한 조항인지 확인해서 알려드릴게요",
  },
  {
    title: "처음 이사온 날 그대로, 우리집 모습 기록",
    description:
      "집주인에게 보여줄 수 있도록 이사온 집의 사진과 글을 기록해서 보관해둘 수 있어요",
  },
];

/**
 * 온보딩 0단계의 서비스 소개 카드 3개 (Figma node 1212:14980).
 */
export default function FeatureCardList() {
  return (
    <View className="w-full ">
      {FEATURE_CARDS.map((card) => (
        <View key={card.title} className="w-full px-0 py-2">
          <View className="w-full gap-1 rounded-2xl bg-[#FAFAFD] px-4 py-7">
            <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-primary-500">
              {card.title}
            </Text>
            <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-600 mt-2">
              {card.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
