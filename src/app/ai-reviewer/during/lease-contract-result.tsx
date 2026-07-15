import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import Badge from "../../../components/Badge";
import BottomSheet from "../../../components/BottomSheet";
import RiskAccordionCard from "../../../features/ai-reviewer/components/brokerage-result/RiskAccordionCard";
import ComparisonInfoRow from "../../../features/ai-reviewer/components/brokerage-result/ComparisonInfoRow";
import { useDocumentProgressStore } from "../../../features/ai-reviewer/store/useDocumentProgressStore";

const backIcon = require("../../../../assets/icons/ic_left.png");
const cautionIcon = require("../../../../assets/icons/ic_caution_colored.png");
const checkIcon = require("../../../../assets/icons/icon_check.png");

const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 280;

type PositiveNegativeStatus = "positive" | "negative";

type StepVariant = {
  title: string;
  subtitlePrefix: string;
  subtitleHighlight?: string;
  subtitleSuffix?: string;
  /** 없으면 위험 카드 미표시 (positive 상태) */
  risk?: {
    label: string;
    statusText: string;
    description: string;
  };
  info: {
    label: string;
    value: string;
  };
};

type ResultStep = {
  badgeLabel: string;
  status: PositiveNegativeStatus;
  positive: StepVariant;
  negative: StepVariant;
};

/**
 * 임대차 계약서 OCR 결과 4단계 고정 순서:
 * 1. 합의 금액과 기간의 일치성
 * 2. 계약서 간 항목의 일치성
 * 3. 집주인 신상과 서류상 일치성
 * 4. 중개수수료 확인
 * TODO(API 대기): 실제 분석 API가 붙으면 각 단계의 status/variant 데이터를 응답 데이터로 대체할 것.
 */
const RESULT_STEPS: ResultStep[] = [
  {
    badgeLabel: "건축물대장과 일치여부",
    status: "positive",
    positive: {
      title: "합의 금액과 기간의 일치성을 확인했어요",
      subtitlePrefix: "건축물대장과 금액과 기간이 일치해요",
      info: { label: "123만원", value: "이상없음" },
    },
    negative: {
      title: "합의 금액과 기간의 일치성을 확인했어요",
      subtitlePrefix: "건축물대장과 ",
      subtitleHighlight: "금액 또는 기간이 달라요",
      risk: {
        label: "합의 금액/기간",
        statusText: "위험, 확인이 필요해요",
        description:
          "계약서에 적힌 보증금, 월세, 계약기간이 건축물대장이나 합의 내용과 다르면 계약 전 집주인과 다시 확인해야 해요.",
      },
      info: { label: "123만원", value: "확인 필요" },
    },
  },
  {
    badgeLabel: "집주인과 합의한 내용 확인",
    status: "negative",
    positive: {
      title: "계약서 간 항목의 일치성을 확인했어요",
      subtitlePrefix: "특약사항에 적힌 기간 정보와 계약서 상 기간이 일치해요",
      info: { label: "123만원", value: "이상없음" },
    },
    negative: {
      title: "계약서 간 항목의 일치성을 확인했어요",
      subtitlePrefix: "특약사항에 적힌 기간 정보와 계약서 상 ",
      subtitleHighlight: "기간이 달라요",
      risk: {
        label: "계약기간",
        statusText: "위험, 확인이 필요해요",
        description:
          "특약사항에 적힌 기간과 계약서 본문 기간이 다르면 계약 종료일이나 갱신 조건을 두고 분쟁이 생길 수 있어요. 계약 전 집주인과 기간을 다시 확인하세요.",
      },
      info: { label: "123만원", value: "이상없음" },
    },
  },
  {
    badgeLabel: "집주인 신상 확인",
    status: "positive",
    positive: {
      title: "집주인 신상과 서류상 일치성을 확인했어요",
      subtitlePrefix: "신분증, 등기부등본과 집주인이 일치해요",
      info: { label: "소유자", value: "김민숙/ 1976.01.20 (동일)" },
    },
    negative: {
      title: "집주인 신상과 서류상 일치성을 확인했어요",
      subtitlePrefix: "신분증, 등기부등본과 ",
      subtitleHighlight: "집주인 정보가 달라요",
      risk: {
        label: "집주인 정보",
        statusText: "위험, 확인이 필요해요",
        description:
          "계약서의 임대인 정보가 신분증이나 등기부등본과 다르면 대리 계약 여부와 위임장, 인감증명서 등을 반드시 확인해야 해요.",
      },
      info: { label: "소유자", value: "김민숙/ 1976.01.20 (불일치)" },
    },
  },
  {
    badgeLabel: "중개수수료",
    status: "positive",
    positive: {
      title: "중개수수료를 확인하세요",
      subtitlePrefix: "중개수수료는 보통 보증금의 n%예요",
      info: { label: "중개수수료", value: "150,000원" },
    },
    negative: {
      title: "중개수수료를 확인하세요",
      subtitlePrefix: "중개수수료가 ",
      subtitleHighlight: "법정 상한을 초과",
      subtitleSuffix: "했을 수 있어요",
      risk: {
        label: "중개수수료",
        statusText: "위험, 확인이 필요해요",
        description:
          "중개수수료는 법으로 정한 상한 요율이 있어요. 상한을 초과해서 받았다면 초과분을 돌려받을 수 있으니 계약서와 영수증을 꼭 보관하세요.",
      },
      info: { label: "중개수수료", value: "150,000원" },
    },
  },
];

/**
 * 임대차 계약서 - 촬영한 서류 OCR/비교 결과 바텀시트
 * (Figma node 934:8628)
 * - 중개대상물 확인 설명서 결과 화면과 같은 흐름
 * - 1단계는 요청대로 "다음으로" 단일 버튼만 표시
 */
export default function LeaseContractResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const step = RESULT_STEPS[stepIndex];
  const variant = step.status === "positive" ? step.positive : step.negative;
  const markCompleted = useDocumentProgressStore((state) => state.markCompleted);

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [sheetTranslateY]);

  const isLastStep = stepIndex === RESULT_STEPS.length - 1;

  const handleNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, RESULT_STEPS.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = () => {
    markCompleted("lease-contract");
    router.replace("/ai-reviewer");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]}>
        <TopBar
          title="임대차계약서"
          leftIcon={backIcon}
          onPressLeft={() => router.back()}
        />
      </SafeAreaView>

      <View className="flex-1">
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            className="absolute inset-0"
            resizeMode="cover"
          />
        )}
      </View>

      <Animated.View
        className="absolute bottom-0 w-full"
        style={{ transform: [{ translateY: sheetTranslateY }] }}
      >
        <BottomSheet>
          <View className="w-full">
            <Badge label={step.badgeLabel} />

            <View className="pt-3 w-full gap-1">
              <Text
                className="w-full font-pretendard-semibold text-18 font-semibold leading-[26px]"
                style={{ color: "rgba(0, 0, 0, 0.79)" }}
              >
                {variant.title}
              </Text>
              <Text className="w-full font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-500">
                {variant.subtitlePrefix}
                {variant.subtitleHighlight ? (
                  <Text className="text-secondary-500">
                    {variant.subtitleHighlight}
                  </Text>
                ) : null}
                {variant.subtitleSuffix}
              </Text>
            </View>

            {variant.risk && (
              <View className="mt-6 w-full">
                <RiskAccordionCard
                  key={stepIndex}
                  icon={cautionIcon}
                  label={variant.risk.label}
                  statusText={variant.risk.statusText}
                  description={variant.risk.description}
                  defaultExpanded={false}
                />
              </View>
            )}

            <View className="mt-6 w-full">
              <ComparisonInfoRow
                icon={checkIcon}
                label={variant.info.label}
                value={variant.info.value}
              />
            </View>

            {stepIndex === 0 ? (
              <Pressable
                onPress={handleNext}
                className="mt-[32px] h-11 w-full items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="다음으로"
              >
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-50">
                  다음으로
                </Text>
              </Pressable>
            ) : (
              <View className="mt-[32px] w-full flex-row justify-between gap-3">
                <Pressable
                  onPress={handlePrevious}
                  className="h-11 flex-1 items-center justify-center rounded-xl bg-gray-50 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="이전으로"
                >
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                    이전으로
                  </Text>
                </Pressable>
                <Pressable
                  onPress={isLastStep ? handleConfirm : handleNext}
                  className="h-11 flex-1 items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel={isLastStep ? "확인" : "다음으로"}
                >
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-50">
                    {isLastStep ? "확인" : "다음으로"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </BottomSheet>
      </Animated.View>
    </View>
  );
}
