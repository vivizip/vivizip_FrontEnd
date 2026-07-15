import React from "react";
import { Text, View } from "react-native";
import { useRouter, type Href } from "expo-router";

import TipCard from "./TipCard";

type Tip = {
  title: string;
  date: string;
  /** 눌렀을 때 이동할 아티클 라우트 - 없으면 눌러도 아무 동작 안 함 */
  route?: Href;
};

type Props = {
  tips: Tip[];
};

/**
 * "입주민 추천 콘텐츠" 섹션 (Figma node 1082:10171) - 제목 + TipCard 리스트
 */
export default function RecommendedTipsSection({ tips }: Props) {
  const router = useRouter();

  return (
    <View className="w-full gap-4">
      <Text className="text-title-m text-gray-800">입주민 추천 콘텐츠</Text>
      <View className="w-full gap-2">
        {tips.map((tip) => (
          <TipCard
            key={tip.title}
            title={tip.title}
            date={tip.date}
            onPress={tip.route ? () => router.push(tip.route as Href) : undefined}
          />
        ))}
      </View>
    </View>
  );
}
