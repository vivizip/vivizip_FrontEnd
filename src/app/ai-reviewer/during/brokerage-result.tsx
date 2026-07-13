import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import Badge from "../../../components/Badge";
import BottomSheet from "../../../components/BottomSheet";
import RiskAccordionCard from "../../../features/ai-reviewer/components/brokerage-result/RiskAccordionCard";
import ComparisonInfoRow from "../../../features/ai-reviewer/components/brokerage-result/ComparisonInfoRow";

const backIcon = require("../../../../assets/icons/ic_left.png");
const cautionIcon = require("../../../../assets/icons/ic_caution_colored.png");
const checkIcon = require("../../../../assets/icons/icon_check.png");

// 시트가 화면 밖에서 시작하도록 하는 오프셋 (houses.tsx 케밥 시트와 동일 패턴)
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
 * 중개대상물 확인 설명서 OCR 결과 4단계 고정 순서 (제목 기준):
 * 1. 건물 일치, 불법 여부를 확인했어요
 * 2. 계약자 정보와 근저당권 여부를 확인했어요
 * 3. 특약사항을 분석했어요
 * 4. 계약서 간 비용이 일치하는지 분석했어요
 * TODO(API 대기): 4단계는 아직 콘텐츠가 없어 미구현. 실제 분석 API 나오면 이 배열 전체를
 * 응답 데이터(+status)로 대체할 것. Figma 캡처가 없는 부분(각 단계 positive 문구,
 * 1/3단계 negative 위험 설명 등)은 전부 목업 텍스트.
 */
const RESULT_STEPS: ResultStep[] = [
  {
    badgeLabel: "건축물대장과 일치여부",
    status: "positive",
    positive: {
      title: "건물 일치, 불법 여부가 없어요",
      subtitlePrefix: "건물 용도가 일치하고, 불법 건축물이 아니에요",
      info: { label: "건물 용도", value: "이상 없음" },
    },
    negative: {
      title: "건물 일치, 불법 여부를 확인했어요",
      subtitlePrefix: "건물 용도는 일치하지만, 불법 가능성이 있어요",
      risk: {
        label: "건물 불법 여부",
        statusText: "위험, 확인이 필요해요",
        description:
          "건물이 불법으로 증축되었거나 용도를 무단으로 변경한 경우, 강제 철거되거나 벌금이 부과될 수 있어요. 계약 전 반드시 확인이 필요해요.",
      },
      info: { label: "건물 용도", value: "이상 없음" },
    },
  },
  {
    badgeLabel: "등기부등본과 비교",
    status: "positive",
    positive: {
      title: "계약자와 근저당권 여부가 깨끗해요",
      subtitlePrefix: "전 서류와 비교한 결과, 소유자가 동일하고 근저당권 문제도 없어요",
      info: { label: "소유자", value: "김민숙/ 1976.01.20 (동일)" },
    },
    negative: {
      title: "계약자와 근저당권 여부를 확인했어요",
      subtitlePrefix: "전 서류와 비교한 결과, 소유자는 동일했지만 ",
      subtitleHighlight: "근저당권 문제",
      subtitleSuffix: "가 있어요",
      risk: {
        label: "근저당권 여부",
        statusText: "위험, 확인이 필요해요",
        description:
          "위험 비율이 60퍼센트 이상이면 위험한 것으로 측정해요. 집이 경매로 매각될 경우, 보증금의 전부를 돌려받지 못할 수 있어요.",
      },
      info: { label: "소유자", value: "김민숙/ 1976.01.20 (동일)" },
    },
  },
  {
    badgeLabel: "임대차 계약서 세부사항",
    status: "positive",
    positive: {
      title: "특약사항을 분석했어요",
      subtitlePrefix: "특약문구의 구체성과 명의계좌, 영수증 정보를 확인했어요",
      info: { label: "특약 조항", value: "이상 없음" },
    },
    negative: {
      title: "특약사항에 확인이 필요해요",
      subtitlePrefix: "특약문구가 모호하거나 ",
      subtitleHighlight: "명의계좌 불일치",
      subtitleSuffix: "가 있어요",
      risk: {
        label: "특약 조항",
        statusText: "위험, 확인이 필요해요",
        description:
          "특약 문구가 모호하면 나중에 분쟁이 생길 수 있어요. 계좌 명의가 임대인과 다르면 반드시 이유를 확인하고, 가능하면 임대인 명의 계좌로만 입금하세요.",
      },
      info: { label: "특약 조항", value: "확인 필요" },
    },
  },
  {
    badgeLabel: "소유권 관련 사항",
    status: "positive",
    positive: {
      title: "계약서 간 비용이 일치하는지 분석했어요",
      subtitlePrefix: "계약서 간 월세, 관리비 등 비용이 일치하는지 확인했어요",
      info: { label: "월세", value: "65만원 / 계약서 간 동일" },
    },
    negative: {
      title: "계약서 간 비용이 일치하지 않아요",
      subtitlePrefix: "계약서 간 ",
      subtitleHighlight: "월세 금액에 차이",
      subtitleSuffix: "가 있어요",
      risk: {
        label: "비용 불일치",
        statusText: "위험, 확인이 필요해요",
        description:
          "계약서마다 적힌 월세나 관리비가 다르면 나중에 분쟁이 생길 수 있어요. 실제 지불할 금액을 집주인과 다시 한번 확인하세요.",
      },
      info: { label: "월세", value: "65만원 / 70만원 (불일치)" },
    },
  },
];

/**
 * 중개대상물 확인 설명서 - 촬영한 서류 OCR/비교 결과 화면
 * (Figma node 934:9144, 934:8956, 934:9058)
 * - 촬영한 사진을 배경 전체에 깔고, 분석 결과 바텀시트가 아래에서 위로 슬라이드업
 * - "다음으로"를 누르면 같은 사진 위에서 바텀시트 내용만 다음 단계로 전환
 * TODO: 1/3 페이지 인디케이터, OCR 인식 영역 하이라이트 박스는 순수 장식이라 생략
 */
export default function BrokerageResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const step = RESULT_STEPS[stepIndex];
  const variant = step.status === "positive" ? step.positive : step.negative;

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
    // TODO: 다음 단계(계약중 나머지 항목) 연동 전까지 뒤로가기로 대체
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]}>
        <TopBar
          title="중개대상물 확인 설명서"
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
          <View className="w-full gap-4">
            <Badge label={step.badgeLabel} />

            <View className="w-full gap-1">
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
              <RiskAccordionCard
                key={stepIndex}
                icon={cautionIcon}
                label={variant.risk.label}
                statusText={variant.risk.statusText}
                description={variant.risk.description}
              />
            )}

            <ComparisonInfoRow
              icon={checkIcon}
              label={variant.info.label}
              value={variant.info.value}
            />

            {isLastStep ? (
              <View className="w-full flex-row justify-between gap-3">
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
                  onPress={handleConfirm}
                  className="h-11 flex-1 items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
                  accessibilityRole="button"
                  accessibilityLabel="확인"
                >
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-50">
                    확인
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handleNext}
                className="h-11 w-full items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="다음으로"
              >
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-50">
                  다음으로
                </Text>
              </Pressable>
            )}
          </View>
        </BottomSheet>
      </Animated.View>
    </View>
  );
}
