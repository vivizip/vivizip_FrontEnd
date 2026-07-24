import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import Badge from "../../../components/Badge";
import BottomSheet from "../../../components/BottomSheet";
import RiskAccordionCard from "../../../features/ai-reviewer/components/brokerage-result/RiskAccordionCard";
import ComparisonInfoRow from "../../../features/ai-reviewer/components/brokerage-result/ComparisonInfoRow";
import { useDocumentProgressStore } from "../../../features/ai-reviewer/store/useDocumentProgressStore";
import { useDocumentAnalysisStore } from "../../../features/ai-reviewer/store/useDocumentAnalysisStore";
import { useRegisteredHouseStore } from "../../../features/ai-reviewer/store/useRegisteredHouseStore";
import {
  getBrokerageAnalysis,
  type BrokerageAnalysisResult,
} from "../../../features/ai-reviewer/services/brokerageDocumentApi";
import { useToastStore } from "../../../store/useToastStore";

const backIcon = require("../../../../assets/icons/ic_left.png");
const cautionIcon = require("../../../../assets/icons/ic_caution_colored.png");
const checkIcon = require("../../../../assets/icons/icon_check.png");

const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 280;

type StepStatus = "positive" | "negative" | "neutral";

type InfoRow = {
  label: string;
  value: string;
};

type StepVariant = {
  title: string;
  subtitlePrefix: string;
  subtitleHighlight?: string;
  subtitleSuffix?: string;
  /** 없으면 위험 카드 미표시 */
  risk?: {
    label: string;
    statusText: string;
    description: string;
  };
  infoRows: InfoRow[];
};

type ResultStep = {
  badgeLabel: string;
  status: StepStatus;
  positive: StepVariant;
  /** negative 상태를 쓰지 않는 단계(중개수수료/보험확인)는 생략 */
  negative?: StepVariant;
  /** 등기부등본이 아직 없어 비교 전인 상태 */
  neutral?: StepVariant;
};

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

// POST /api/documents/brokerage-document/upload-analyze 응답이 없을 때(직접 접근 등)의
// 안전한 기본값 - 실제 플로우에서는 analyzing.tsx가 항상 먼저 분석 결과를 저장해둔다.
const FALLBACK_ANALYSIS: BrokerageAnalysisResult = {
  basicInfo: { matchesRegistry: null, owner: "-", roadAddress: "-", regions: [] },
  mortgage: { matchesRegistry: null, regions: [] },
  liability: { regions: [] },
  brokerageFee: null,
};

/**
 * 중개대상물 확인·설명서 OCR 결과 4단계 (Figma node 2813:21735, 2813:21860,
 * 2813:21785, 2813:21827 순서 그대로):
 * 1. 기본정보 확인 - 소유자·도로명주소 (basicInfo.matchesRegistry)
 * 2. 근저당 확인 (mortgage.matchesRegistry)
 * 3. 중개수수료 확인 (brokerageFee) - 법정 상한 안내는 항상 고정 문구,
 *    실제 초과 여부를 판단할 데이터가 없어 상태 구분 없이 정보성으로만 노출
 * 4. 배상책임보험 안내 (과실 피해 예방) - liability 데이터와 무관하게 항상 같은
 *    안내 문구만 보여주는 정보성 단계 (Figma에 매칭/불일치 표현이 없음)
 * matchesRegistry가 null이면(등기부등본 미등록) neutral 문구로 안내한다.
 * negative(불일치) 카피는 Figma에 캡처가 없어 positive 카피와 같은 구조로 새로 작성함.
 */
const buildResultSteps = (analysis: BrokerageAnalysisResult): ResultStep[] => {
  const { basicInfo, mortgage, brokerageFee } = analysis;

  const basicInfoStep: ResultStep = {
    badgeLabel: "기본정보 확인",
    status:
      basicInfo.matchesRegistry === true
        ? "positive"
        : basicInfo.matchesRegistry === false
          ? "negative"
          : "neutral",
    positive: {
      title: "소유자와 건물의 기본정보를 확인했어요",
      subtitlePrefix: "기본 정보가 ",
      subtitleHighlight: "등기부등본과 일치해요",
      infoRows: [
        { label: "소유자", value: basicInfo.owner || "-" },
        { label: "도로명주소", value: basicInfo.roadAddress || "-" },
      ],
    },
    negative: {
      title: "소유자와 건물의 기본정보를 확인했어요",
      subtitlePrefix: "기본 정보가 ",
      subtitleHighlight: "등기부등본과 일치하지 않아요",
      risk: {
        label: "소유자/주소 불일치",
        statusText: "위험, 확인이 필요해요",
        description:
          "등기부등본과 소유자나 주소가 다르면 실제 집주인이 맞는지, 정확한 매물인지 다시 확인해야 해요. 계약 전 반드시 공인중개사에게 이유를 물어보세요.",
      },
      infoRows: [
        { label: "소유자", value: basicInfo.owner || "-" },
        { label: "도로명주소", value: basicInfo.roadAddress || "-" },
      ],
    },
    neutral: {
      title: "소유자와 건물의 기본정보를 확인했어요",
      subtitlePrefix: "아직 등록된 등기부등본이 없어 비교하지 못했어요",
      infoRows: [
        { label: "소유자", value: basicInfo.owner || "-" },
        { label: "도로명주소", value: basicInfo.roadAddress || "-" },
      ],
    },
  };

  const mortgageStep: ResultStep = {
    badgeLabel: "근저당",
    status:
      mortgage.matchesRegistry === true
        ? "positive"
        : mortgage.matchesRegistry === false
          ? "negative"
          : "neutral",
    positive: {
      title: "근저당권 여부를 확인했어요",
      subtitlePrefix: "등기부등본과 비교한 결과, ",
      subtitleHighlight: "근저당권 여부가 일치해요",
      infoRows: [],
    },
    negative: {
      title: "근저당권 여부를 확인했어요",
      subtitlePrefix: "등기부등본과 비교한 결과, ",
      subtitleHighlight: "근저당권 확인이 필요해요",
      risk: {
        label: "근저당권 여부",
        statusText: "위험, 확인이 필요해요",
        description:
          "위험 비율이 60퍼센트 이상이면 위험한 것으로 측정해요. 집이 경매로 매각될 경우, 보증금의 전부를 돌려받지 못할 수 있어요.",
      },
      infoRows: [],
    },
    neutral: {
      title: "근저당권 여부를 확인했어요",
      subtitlePrefix: "아직 등록된 등기부등본이 없어 비교하지 못했어요",
      infoRows: [],
    },
  };

  const brokerageFeeStep: ResultStep = {
    badgeLabel: "중개 수수료 확인",
    status: "positive",
    positive: {
      title: "중개수수료를 확인하세요",
      subtitlePrefix:
        "거래금액이 5천만원 이하일 시 최대 법적 수수료는 거래 금액의 0.6%로 한도액 25만원이에요",
      infoRows: [
        {
          label: "중개수수료",
          value: brokerageFee != null ? formatWon(brokerageFee) : "확인되지 않음",
        },
      ],
    },
  };

  const liabilityStep: ResultStep = {
    badgeLabel: "과실 피해 예방",
    status: "positive",
    positive: {
      title: "배상책임보험 부분 내용을 잘 확인하세요",
      subtitlePrefix:
        "배상책임보험 가입 여부를 확인하여 중개사의 과실로 피해가 발생할 경우 보상을 받을 수 있는지 확인합니다.",
      infoRows: [],
    },
  };

  return [basicInfoStep, mortgageStep, brokerageFeeStep, liabilityStep];
};

/**
 * 중개대상물 확인 설명서 - 촬영한 서류 OCR/비교 결과 화면
 * (Figma node 2813:21735, 2813:21860, 2813:21785, 2813:21827)
 * - 촬영한 사진을 배경 전체에 깔고, 분석 결과 바텀시트가 아래에서 위로 슬라이드업
 * - "다음으로"를 누르면 같은 사진 위에서 바텀시트 내용만 다음 단계로 전환
 * TODO: regions(하이라이트 박스)는 아직 이미지 위에 그리지 않음 - 필요해지면 추가.
 */
export default function BrokerageResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const currentHouseId = useRegisteredHouseStore(
    (state) => state.currentHouseId,
  );
  const brokerageAnalysisByHouse = useDocumentAnalysisStore(
    (state) => state.brokerageAnalysisByHouse,
  );
  const brokerageAnalysis = currentHouseId
    ? brokerageAnalysisByHouse[currentHouseId] ?? null
    : null;
  const setBrokerageAnalysis = useDocumentAnalysisStore(
    (state) => state.setBrokerageAnalysis,
  );

  // 재촬영 없이 체크리스트에서 완료된 항목을 다시 열었을 때(store가 비어있을 때)만
  // 저장된 분석 결과를 다시 불러온다 - 업로드 직후 진입은 store에 이미 있어 재조회하지 않는다.
  useEffect(() => {
    if (brokerageAnalysis || !currentHouseId) return;
    let cancelled = false;
    getBrokerageAnalysis(Number(currentHouseId))
      .then((result) => {
        if (!cancelled) setBrokerageAnalysis(currentHouseId, result);
      })
      .catch((err) => {
        if (!cancelled) {
          useToastStore
            .getState()
            .show(
              err instanceof Error
                ? err.message
                : "중개대상물 분석 결과를 불러오지 못했어요.",
            );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [brokerageAnalysis, currentHouseId, setBrokerageAnalysis]);

  const resultSteps = useMemo(
    () => buildResultSteps(brokerageAnalysis ?? FALLBACK_ANALYSIS),
    [brokerageAnalysis],
  );
  const step = resultSteps[stepIndex];
  const variant =
    (step.status === "negative"
      ? step.negative
      : step.status === "neutral"
        ? step.neutral
        : step.positive) ?? step.positive;
  const markCompleted = useDocumentProgressStore((state) => state.markCompleted);

  useEffect(() => {
    Animated.timing(sheetTranslateY, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [sheetTranslateY]);

  const isLastStep = stepIndex === resultSteps.length - 1;

  const handleNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, resultSteps.length - 1));
  };

  const handlePrevious = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirm = () => {
    if (currentHouseId) markCompleted(currentHouseId, "brokerage");
    router.replace("/ai-reviewer");
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
                  <Text
                    className={
                      step.status === "negative"
                        ? "text-secondary-500"
                        : "text-primary-500"
                    }
                  >
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
                />
              </View>
            )}

            {variant.infoRows.length > 0 && (
              <View className="mt-6 w-full gap-2">
                {variant.infoRows.map((row) => (
                  <ComparisonInfoRow
                    key={row.label}
                    icon={checkIcon}
                    label={row.label}
                    value={row.value}
                  />
                ))}
              </View>
            )}

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
