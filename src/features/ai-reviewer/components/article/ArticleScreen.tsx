import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../../components/TopBar";
import HeartEmptyIcon from "../../../../../assets/icons/icon_heart_empty.svg";
import HeartFilledIcon from "../../../../../assets/icons/icon_heart_filled.svg";

const backIcon = require("../../../../../assets/icons/ic_left.png");

type Props = {
  heroImage: ImageSourcePropType;
  category: string;
  title: string;
  date: string;
  views: number;
  intro: string;
  closingText: string;
  children: React.ReactNode;
};

/**
 * "입주민 추천 콘텐츠" 아티클 공통 화면 셸 (Figma node 1179:15225, 1179:15289)
 * - 히어로 이미지 → 제목/날짜/조회수 → 인트로 → {children}(번호 섹션들) → 마치며 → 서비스 소개 → 좋아요
 * - 서비스 소개(pitch)와 CTA 문구는 모든 아티클에서 동일해서 여기 고정
 */
export default function ArticleScreen({
  heroImage,
  category,
  title,
  date,
  views,
  intro,
  closingText,
  children,
}: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleToggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="입주 기록"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Image
          source={heroImage}
          className="h-[170px] w-full"
          resizeMode="cover"
        />

        <View className="w-full gap-3 px-4 py-3">
          <View className="w-full gap-1">
            <Text className="font-pretendard-semibold text-16 font-semibold leading-6 text-gray-600">
              {category}
            </Text>
            <Text className="text-headline-m text-gray-800">{title}</Text>
          </View>
          <View className="w-full flex-row items-center gap-1">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              {date}
            </Text>
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              조회 {views}
            </Text>
          </View>
          <View className="h-px w-full bg-gray-100" />
        </View>

        <Text className="w-full px-4 py-3 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
          {intro}
        </Text>

        {children}

        <View className="w-full gap-2 px-4 py-3">
          <Text className="text-headline-s text-gray-800">마치며</Text>
          <Text className="w-full font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
            {closingText}
          </Text>
        </View>

        <View className="w-full gap-2 px-4 py-3">
          <Text className="text-title-m text-gray-800">
            VIVIZIP에서 안전하고 즐겁게 집을 계약해요
          </Text>
          <View className="w-full gap-0.5">
            <View className="w-full flex-row gap-1">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                •
              </Text>
              <Text className="flex-1 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                믿을 수 있는 같은 학교 친구와 부동산 동행 1:1 매칭
              </Text>
            </View>
            <View className="w-full flex-row gap-1">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                •
              </Text>
              <Text className="flex-1 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                AI 서류 분석으로 계약 전, 중, 후 위험한 조항 확인
              </Text>
            </View>
            <View className="w-full flex-row gap-1">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                •
              </Text>
              <Text className="flex-1 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                입주 사진 및 기록 남기기
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full items-center gap-3 px-4 py-3">
          <Text className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
            한국에서의 막막했던 집 구하는 여정을 VIVIZIP이{"\n"}처음부터 끝까지
            도와줄게요 편하게 시작해 보세요!
          </Text>
          <View className="w-[140px] items-center gap-3">
            <Text className="w-full text-center font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-800">
              이 콘텐츠가 도움이 되었다면?
            </Text>
            <Pressable
              onPress={handleToggleLike}
              className="flex-row items-center gap-2 rounded-[500px] bg-gray-100 px-3 py-1.5 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="좋아요"
            >
              {liked ? (
                <HeartFilledIcon width={24} height={24} color="#EF5D70" />
              ) : (
                <HeartEmptyIcon width={24} height={24} color="#272B33" />
              )}
              <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-800">
                {likeCount}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
