import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import type { ArticleMeta } from "../../ai-reviewer/articles";

type Props = {
  article: ArticleMeta;
  onPress: () => void;
};

/**
 * "아티클 ZIP" 목록의 아티클 한 줄 (Figma node 1915:33514 등) - 제목+설명 2줄 + 썸네일.
 */
export default function ArticleZipCard({ article, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center gap-1 py-2 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={article.title}
    >
      <View className="flex-1 gap-1">
        <Text
          numberOfLines={1}
          className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800"
        >
          {article.title}
        </Text>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className="font-pretendard text-12 leading-4 text-gray-500"
        >
          {article.description}
        </Text>
      </View>
      <Image
        source={article.thumbnail}
        className="h-14 w-14 rounded-lg ml-4"
        resizeMode="cover"
      />
    </Pressable>
  );
}
