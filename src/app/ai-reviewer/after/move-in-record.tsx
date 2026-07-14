import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import TipCard from "../../../features/ai-reviewer/components/move-in-record/TipCard";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../assets/icons/ic_kebab.png");

// TODO(API 대기): 실제 입주 기록 목록 API 나오기 전까지 Figma 목업과 동일한 정적 데이터 사용
const RECOMMENDED_TIPS = [
  {
    title: "입주 첫 날, 집 사진을 꼭 찍어야 하는 이유",
    date: "2026.07.04",
  },
  {
    title: "집에 문제가 생겼다면 누구에게 연락해야 할까요",
    date: "2026.07.06",
  },
];

/**
 * 입주 상태 기록 진입 화면 - 아직 작성된 기록이 없는 상태 (Figma node 1082:10171, "입주 기록 OFF")
 * TODO: 데코 일러스트(집 모양 아이콘, 빈 상태 배경 그래픽)는 생략.
 * TODO: "새로운 집 추가하기"를 누르면 이어질 실제 촬영/기록 플로우는 아직 미정 - 자리만 잡음.
 */
export default function MoveInRecordScreen() {
  const router = useRouter();

  const handleAddNewHouse = () => {
    console.log("[MoveInRecord] 새로운 집 추가하기 - TODO: 촬영/기록 플로우 연결");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="입주 기록"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
        rightIcon={kebabIcon}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 히어로 배너 */}
        <View className="h-[110px] w-full justify-end gap-3 rounded-2xl bg-[#F2F7FC] px-4 py-3">
          <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-700">
            새로운 집을 구하신 것을 축하드려요!
          </Text>
        </View>

        {/* 입주 기록 리스트 (빈 상태) */}
        <View className="w-full gap-4">
          <View className="w-full flex-row items-center justify-between">
            <Text className="text-title-m text-gray-800">입주 기록 리스트</Text>
            <View className="flex-row items-center gap-1">
              <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-800">
                최신순
              </Text>
            </View>
          </View>

          <View className="w-full items-center gap-4 rounded-2xl bg-gray-50 px-4 py-8">
            <Text className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              작성된 입주기록이 없어요..
            </Text>
            <Pressable
              onPress={handleAddNewHouse}
              className="h-10 w-full items-center justify-center rounded-[10px] bg-primary-500 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="새로운 집 추가하기"
            >
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-white">
                새로운 집 추가하기
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 입주민 추천 콘텐츠 */}
        <View className="w-full gap-4">
          <Text className="text-title-m text-gray-800">입주민 추천 콘텐츠</Text>
          <View className="w-full gap-2">
            {RECOMMENDED_TIPS.map((tip) => (
              <TipCard key={tip.title} title={tip.title} date={tip.date} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
