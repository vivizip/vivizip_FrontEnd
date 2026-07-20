import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { isAxiosError } from "axios";

const backIcon = require("../../../assets/icons/ic_left.png");
const loadingDocumentImage = require("../../../assets/images/loading_document.png");

import TopBar from "../../components/TopBar";
import { useRegisteredHouseStore } from "../../features/ai-reviewer/store/useRegisteredHouseStore";
import { useDocumentAnalysisStore } from "../../features/ai-reviewer/store/useDocumentAnalysisStore";
import { uploadAndAnalyzeRegistry } from "../../features/ai-reviewer/services/registryDocumentApi";
import { uploadAndAnalyzeBuildingLedger } from "../../features/ai-reviewer/services/buildingLedgerApi";
import { useToastStore } from "../../store/useToastStore";

const FALLBACK_ANALYZE_ERROR = "서류 분석에 실패했어요. 다시 시도해주세요.";

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
  const currentHouseId = useRegisteredHouseStore(
    (state) => state.currentHouseId,
  );
  const setRegistryAnalysis = useDocumentAnalysisStore(
    (state) => state.setRegistryAnalysis,
  );
  const setBuildingLedgerAnalysis = useDocumentAnalysisStore(
    (state) => state.setBuildingLedgerAnalysis,
  );

  const hasResultScreen =
    documentType === "registry" ||
    documentType === "building" ||
    documentType === "brokerage" ||
    documentType === "lease-contract";

  // 등기부등본/건축물대장을 사진 촬영으로 발급한 경우에만 실제 업로드+분석 API를 호출한다.
  // (앱 발급 경로는 imageUri가 없어 아래 else 분기의 임시 타이머로 진행. brokerage/lease-contract는 아직 미연동)
  const isRealUpload =
    (documentType === "registry" || documentType === "building") &&
    !!imageUri;

  useEffect(() => {
    if (!isRealUpload) return;
    if (!currentHouseId) {
      useToastStore
        .getState()
        .show("집 주소를 먼저 등록해주세요.");
      router.back();
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        if (documentType === "building") {
          const result = await uploadAndAnalyzeBuildingLedger(
            Number(currentHouseId),
            imageUri as string,
          );
          if (cancelled) return;
          setBuildingLedgerAnalysis(result);
        } else {
          const result = await uploadAndAnalyzeRegistry(
            Number(currentHouseId),
            [imageUri as string],
          );
          if (cancelled) return;
          setRegistryAnalysis(result);
        }
        router.replace({
          pathname: "/ai-reviewer/document-result",
          params: { documentType },
        });
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err)) {
          console.log(
            "[Analyzing] upload/analyze failed:",
            err.response?.status,
            JSON.stringify(err.response?.data),
          );
        } else {
          console.log("[Analyzing] upload/analyze failed:", String(err));
        }
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_ANALYZE_ERROR);
        router.back();
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [
    currentHouseId,
    documentType,
    imageUri,
    isRealUpload,
    router,
    setBuildingLedgerAnalysis,
    setRegistryAnalysis,
  ]);

  // TEST ONLY: 분석 API가 없는 나머지 문서 종류는 완료 신호를 흉내내는 임시 타이머 유지.
  // API 나오면 폴링 완료 콜백으로 교체하고 이 useEffect는 제거할 것.
  useEffect(() => {
    if (!hasResultScreen || isRealUpload) return;
    const timer = setTimeout(() => {
      if (documentType === "brokerage") {
        router.replace({
          pathname: "/ai-reviewer/during/brokerage-result",
          params: { imageUri },
        });
        return;
      }
      if (documentType === "lease-contract") {
        router.replace({
          pathname: "/ai-reviewer/during/lease-contract-result",
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
  }, [documentType, hasResultScreen, imageUri, isRealUpload, router]);

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
