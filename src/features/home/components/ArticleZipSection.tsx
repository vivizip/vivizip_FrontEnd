import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import ArticleZipCard from "./ArticleZipCard";
import { ARTICLES } from "../../ai-reviewer/articles";

/**
 * "아티클 ZIP" 섹션 (Figma node 1915:33510).
 * ai-reviewer의 "계약 후" 단계 추천 콘텐츠 아티클을 그대로 재사용해서 보여준다.
 */
export default function ArticleZipSection() {
  const router = useRouter();

  return (
    <View className="w-full gap-2">
      <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-900">
        아티클 ZIP
      </Text>
      <View
        className="w-full rounded-xl bg-white px-4 py-4 gap-2"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 3,
          elevation: 1,
        }}
      >
        {ARTICLES.map((article) => (
          <ArticleZipCard
            key={article.id}
            article={article}
            onPress={() => router.push(article.route)}
          />
        ))}
      </View>
    </View>
  );
}
