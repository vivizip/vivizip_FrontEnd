import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import CTAButton from "../../../components/CTAButton";

const backIcon = require("../../../../assets/icons/ic_left.png");
const boomerangIntroIllustration = require("../../../../assets/images/img_boomerang_intro.png");

/**
 * 홈 화면 "부메랑 신청하기"를 누르면 나오는 부메랑(1:1 매칭) 소개 화면 (Figma node 1588:21799).
 * "신청하러 가기"를 누르면 부메랑 신청 온보딩(/matching/onboarding)으로 이동.
 */
export default function BoomerangIntroScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFD]">
      <TopBar
        title="부메랑 소개"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-full rounded-2xl px-4 pt-3 pb-4"
          style={{ backgroundColor: "#EEF6FF" }}
        >
          <View className="w-full" style={{ aspectRatio: 328 / 228 }}>
            <Image
              source={boomerangIntroIllustration}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>

          <View
            className="w-full gap-4 rounded-2xl bg-white px-4 pt-5 pb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.07,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="w-full font-pretendard-semibold text-24 font-semibold leading-[32px] text-primary-500">
              부메랑이란?
            </Text>
            <Text className="w-full font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              '부동산 메이트랑'의 줄임말로 한국어가 서툰 외국인 유학생이
              부동산에서 중개인과 원활하게 소통하고, 꼼꼼하게 집을 확인하고 구할
              수 있도록 같은 학교 서포터즈와 1:1로 매칭하여 동행을 도와주는
              시스템입니다.
            </Text>
          </View>
        </View>

        <View className="w-full gap-6 rounded-2xl px-4 py-3">
          <Text className="w-full font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-800">
            현재 모집 진행중이에요!
          </Text>
          <View className="w-full gap-2">
            <View className="flex-row items-center gap-3">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                활동 기간
              </Text>
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-primary-500">
                2026.07.01~2026.08.31
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                모집 기준
              </Text>
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-primary-500">
                외국인 유학생 선착순 20명
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="w-full px-4 mb-4">
        <CTAButton
          label="신청하러 가기"
          active
          onPress={() => router.push("/matching/onboarding")}
          heightClassName="h-11"
          radiusClassName="rounded-2xl"
        />
      </View>
    </SafeAreaView>
  );
}
