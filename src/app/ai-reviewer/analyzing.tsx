import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

const backIcon = require("../../../assets/icons/ic_left.png");
const loadingDocumentImage = require("../../../assets/images/loading_document.png");

import TopBar from "../../components/TopBar";

const DOT_COUNT = 3;
const DOT_CYCLE_DURATION = 1800; // 한 바퀴(점 하나당 600ms씩 순차 강조)

/**
 * 하나의 진행값(0 -> 3)을 세 점이 나눠 쓰는 방식.
 * 점마다 별도 루프를 돌리면 사이클 길이 계산이 어긋나 순서가 뒤엉키므로(이전 구현의 버그),
 * 단일 타임라인에서 각 점이 자기 구간(i ~ i+1)에서만 반응하게 해 순서를 구조적으로 보장한다.
 */
function useDotsProgress() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: DOT_COUNT,
        duration: DOT_CYCLE_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  // index번째 점: 진행값이 [i, i+1] 구간을 지날 때만 커졌다 작아짐 (구간 밖은 clamp로 고정)
  const dotStyle = (index: number) => ({
    opacity: progress.interpolate({
      inputRange: [index, index + 0.5, index + 1],
      outputRange: [0.3, 1, 0.3],
      extrapolate: "clamp" as const,
    }),
    transform: [
      {
        scale: progress.interpolate({
          inputRange: [index, index + 0.5, index + 1],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: "clamp" as const,
        }),
      },
    ],
  });

  return dotStyle;
}

/**
 * 서류 분석 중 로딩 화면. register-document.tsx의 두 버튼(앱 발급/사진 촬영) 모두
 * 여기로 이동한다 - ai-reviewer 안에서 공통으로 재사용될 화면.
 * TODO: 실제 분석(API 폴링/완료 이동) 연동 전까지 정적 로딩 상태만 표시.
 */
export default function AnalyzingScreen() {
  const router = useRouter();
  const dotStyle = useDotsProgress();
  // 문서 스캐너로 촬영한 보정 이미지 경로 (앱 발급 경로로 진입 시엔 없음)
  // TODO: 분석 API 나오면 이 URI를 업로드하고 완료 폴링 후 결과 화면으로 이동
  const { documentType = "registry", imageUri } = useLocalSearchParams<{
    documentType?: "registry" | "building" | "brokerage" | "lease-contract";
    imageUri?: string;
  }>();
  console.log("[Analyzing] received imageUri:", imageUri);

  // 결과 화면이 아직 없는 문서 종류(lease-contract)는 자동 이동하지 않음
  const hasResultScreen =
    documentType === "registry" ||
    documentType === "building" ||
    documentType === "brokerage";

  // TEST ONLY: 분석 API가 없어 완료 신호를 흉내내는 임시 타이머.
  // API 나오면 폴링 완료 콜백으로 교체하고 이 useEffect는 제거할 것.
  useEffect(() => {
    if (!hasResultScreen) return;
    const timer = setTimeout(() => {
      if (documentType === "brokerage") {
        router.replace({
          pathname: "/ai-reviewer/during/brokerage-result",
          params: { imageUri },
        });
        return;
      }
      router.replace({
        pathname: "/ai-reviewer/document-result",
        params: { documentType },
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [documentType, hasResultScreen, imageUri, router]);

  return (
    <SafeAreaView className="flex-1 bg-[#F2F7FC]">
      <TopBar
        title="서류 분석"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <View className="flex-1 items-center px-4">
        {/* TopBar ↔ 타이틀 96px */}
        <Text className="mt-24 text-center text-headline-l text-gray-900 font-semibold">
          서류를 분석하고 있어요
        </Text>
        {/* 타이틀 ↔ 서브텍스트 8px. Body-s 프리셋은 weight 400이라 스펙(600)과 달라 직접 지정 */}
        <Text className="mt-2 text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
          건물 정보와 소유주를 확인하는 중..
        </Text>

        {/* 서브텍스트 ↔ 로딩 아이콘 34px */}
        <View className="mt-[34px] flex-row items-center gap-1.5">
          {Array.from({ length: DOT_COUNT }, (_, index) => (
            <Animated.View
              key={index}
              style={dotStyle(index)}
              className="h-2 w-2 rounded-full bg-gray-900"
            />
          ))}
        </View>

        {/* 로딩 아이콘 ↔ 문서 이미지 56px. Figma: 214.3x226.07 -> 반올림 */}
        <Image
          source={loadingDocumentImage}
          className="mt-14 h-[226px] w-[214px]"
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
