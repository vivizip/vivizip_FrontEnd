import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

type Props = {
  number: number;
  title: string;
  image: ImageSourcePropType;
  /** 제목 아래, 이미지 위에 들어갈 설명 (ArticleParagraph 등 조합) */
  intro: React.ReactNode;
  /** 이미지 아래에 들어갈 상세 내용 (ArticleParagraph/ArticleBulletList 조합) */
  details: React.ReactNode;
};

/**
 * 아티클 본문의 번호 매겨진 섹션 블록 (Figma node 1179:15244, 1179:15308 등)
 * - 번호+제목(headline-s) → intro → 이미지 → details 순서로 자유 조합
 */
export default function ArticleSection({
  number,
  title,
  image,
  intro,
  details,
}: Props) {
  return (
    <View className="w-full gap-1 px-4 py-3">
      <View className="w-full gap-1">
        <Text className="text-headline-s text-gray-800">
          {number}. {title}
        </Text>
        {intro}
      </View>

      <View className="w-full gap-2 pt-2">
        <Image
          source={image}
          className="h-[166px] w-full rounded-xl"
          resizeMode="cover"
        />
        <View className="w-full gap-0.5">{details}</View>
      </View>
    </View>
  );
}
