import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import LoanCalcSheet from "./LoanCalcSheet";

type Props = {
  cautionIcon: ImageSourcePropType;
  checkIcon: ImageSourcePropType;
  aiIcon: ImageSourcePropType;
  status: "positive" | "negative";
  homePrice: number;
  maxClaimAmount: number;
  initialMyDeposit: number;
};

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")} 만원`;

// 집 시세(homePrice) 대비 비율(%). 막대 너비는 100%로 clamp하되, 라벨(위험 비율)은 실제값을 보여준다.
const toPercent = (value: number, homePrice: number) =>
  homePrice > 0 ? (value / homePrice) * 100 : 0;

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx 케밥 시트와 동일 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

/**
 * 근저당권 위험도 계산 섹션 (Figma node 993:30806)
 * - 안내 카드 + 위험도 계산 카드(막대그래프/직접입력) + AI 팁 배너
 * TODO(API 대기): 위험 비율/막대 너비는 Figma 목업 고정값. 실제 계산 공식은
 * 백엔드 정책 확정 후 연동하고, "직접 입력하기"로 받은 보증금 값을 재계산에 반영할 것.
 */
export default function LoanRiskSection({
  cautionIcon,
  checkIcon,
  aiIcon,
  status,
  homePrice,
  maxClaimAmount,
  initialMyDeposit,
}: Props) {
  const [myDeposit, setMyDeposit] = useState(initialMyDeposit);
  const [depositDraft, setDepositDraft] = useState(initialMyDeposit);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSheetMounted, setIsSheetMounted] = useState(false);
  const isPositive = status === "positive";
  // 위험 비율 = (채권최고액 + 내 보증금) / 집 시세. 막대는 100%로 clamp, 라벨은 실제값 표시.
  const riskRatio = Math.round(toPercent(maxClaimAmount + myDeposit, homePrice));
  const claimBarPercent = Math.min(toPercent(maxClaimAmount, homePrice), 100);
  const depositBarPercent = Math.min(
    toPercent(maxClaimAmount + myDeposit, homePrice),
    100,
  );

  // 배경: opacity 0 -> 0.2 (Figma) / 시트: translateY SHEET_OFFSCREEN_Y -> 0 (slide up)
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (isSheetOpen) {
      setIsSheetMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.2,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSheetOpen, overlayOpacity, sheetTranslateY]);

  const openSheet = () => {
    setDepositDraft(myDeposit);
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_OFFSCREEN_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSheetMounted(false);
      setIsSheetOpen(false);
    });
  };

  const handleAddDeposit = (amount: number) => {
    setDepositDraft((prev) => prev + amount);
  };

  const handleCalculate = () => {
    setMyDeposit(depositDraft);
    closeSheet();
  };

  return (
    <>
      <View className="w-full flex-col items-center gap-5 bg-white">
        <Image
          source={isPositive ? checkIcon : cautionIcon}
          className="h-12 w-12"
          resizeMode="contain"
        />
        <View className="w-full gap-2">
          <Text className="text-headline-s text-center text-gray-900">
            {isPositive ? "근저당권이 확인되지 않았어요" : "근저당권이 확인되었어요"}
          </Text>
          <Text className="w-full text-center text-label-m text-gray-500">
            {
              "근저당권은 집을 담보로 은행에서 돈을 빌린 기록이에요. \n빌린 돈이 많으면 보증금을 돌려받기 어려울 수 있어요."
            }
          </Text>
        </View>
      </View>

      {!isPositive && (
        <View className="w-full gap-2">
          <Text className="text-title-m text-gray-900">근저당권 위험도 계산</Text>
          <View className="w-full gap-2.5 rounded-2xl border border-gray-100 bg-white px-4 py-5">
            <View className="w-full gap-3">
              <View className="w-full flex-row items-center justify-between">
                <Text className="text-label-s text-gray-500">집의 시세</Text>
                <Text className="text-label-s text-gray-900">{formatWon(homePrice)}</Text>
              </View>

              <View className="relative h-3 w-full overflow-hidden rounded-full bg-gray-50">
                <View
                  className="absolute left-0 top-0 h-3 rounded-full bg-secondary-400"
                  style={{ width: `${depositBarPercent}%` }}
                />
                <View
                  className="absolute left-0 top-0 h-3 rounded-full bg-secondary-300"
                  style={{ width: `${claimBarPercent}%` }}
                />
              </View>

              <View className="w-full gap-2">
                <View className="w-full flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-secondary-300" />
                    <Text className="text-label-s text-gray-500">채권최고액</Text>
                  </View>
                  <Text className="text-label-s text-gray-900">{formatWon(maxClaimAmount)}</Text>
                </View>
                <View className="w-full flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="h-3 w-3 rounded-full bg-secondary-400" />
                    <Text className="text-label-s text-gray-500">내 보증금</Text>
                  </View>
                  <Text className="text-label-s text-gray-900">{formatWon(myDeposit)}</Text>
                </View>
              </View>

              <View className="h-px w-full bg-gray-100" />

              <View className="w-full flex-row items-center justify-between">
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                  위험 비율
                </Text>
                <Text className="text-title-m text-secondary-400">{riskRatio}%</Text>
              </View>
            </View>

            <Pressable
              onPress={openSheet}
              className="h-10 w-full items-center justify-center rounded-xl bg-gray-50 active:opacity-70"
              accessibilityRole="button"
            >
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                직접 입력하기
              </Text>
            </Pressable>

            <View className="w-full flex-row gap-1">
              <Text className="font-pretendard text-12 font-normal leading-4 tracking-[-0.24px] text-gray-500">
                *
              </Text>
              <Text className="flex-1 font-pretendard text-12 font-normal leading-4 tracking-[-0.24px] text-gray-500">
                채권최고액과 입력한 정보를 바탕으로 계산한 참고 결과입니다. 실제
                권리관계나 보증금 반환 여부를 보장하지 않습니다.
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="w-full flex-row items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
        <Image
          source={aiIcon}
          className="h-6 w-6"
          resizeMode="contain"
          style={{ width: 24, height: 24 }}
        />
        <Text className="flex-1 font-pretendard-medium text-14 font-medium leading-5 text-gray-600">
          {isPositive
            ? "현재 등기부등본 기준으로 분석한 결과예요. 계약 전 최신 서류인지 다시 확인해 보세요."
            : "위험도가 60% 이상의 경우, 보증금의 전부를 돌려받지 못할 수 있어요."}
        </Text>
      </View>

      <Modal
        visible={isSheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* 배경: fade (Figma: black, opacity 0~0.2) */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#000000",
              opacity: overlayOpacity,
            }}
          />
          {/* 배경 탭 시 닫기 */}
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeSheet}
          />
          {/* 시트: slide up */}
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
            <LoanCalcSheet
              homePrice={homePrice}
              maxClaimAmount={maxClaimAmount}
              depositDraft={depositDraft}
              onAddDeposit={handleAddDeposit}
              onCalculate={handleCalculate}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
