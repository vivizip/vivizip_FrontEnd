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
import type { LeaseContractAnalysisResult } from "../../../features/ai-reviewer/services/leaseContractDocumentApi";

const backIcon = require("../../../../assets/icons/ic_left.png");
const cautionIcon = require("../../../../assets/icons/ic_caution_colored.png");
const checkIcon = require("../../../../assets/icons/icon_check.png");

const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 280;

type StepStatus = "positive" | "negative" | "neutral";

/** 일반 비교 행(초록) 또는 위험 행(빨강, 펼치면 설명 표시) - 한 단계 안에 섞여 나올 수 있다 */
type StepRow =
  | { type: "info"; label: string; value: string }
  | { type: "risk"; label: string; statusText: string; description: string };

type StepVariant = {
  title: string;
  subtitlePrefix: string;
  subtitleHighlight?: string;
  subtitleSuffix?: string;
  rows: StepRow[];
};

type ResultStep = {
  badgeLabel: string;
  status: StepStatus;
  positive: StepVariant;
  negative?: StepVariant;
  neutral?: StepVariant;
};

const formatWon = (value: number) => `${value.toLocaleString("ko-KR")}원`;

// POST /api/documents/lease-contract/upload-analyze 응답이 없을 때(직접 접근 등)의
// 안전한 기본값 - 실제 플로우에서는 analyzing.tsx가 항상 먼저 분석 결과를 저장해둔다.
const FALLBACK_ANALYSIS: LeaseContractAnalysisResult = {
  basicInfo: {
    matchesBrokerageDocument: null,
    owner: "-",
    contractDate: "-",
    roadAddress: "-",
    leaseStartDate: "-",
    leaseEndDate: "-",
    regions: [],
  },
  cost: {
    deposit: 0,
    monthlyRent: null,
    depositMatched: null,
    monthlyRentMatched: null,
    depositMessage: null,
    monthlyRentMessage: null,
    regions: [],
  },
  riskyClauses: [],
};

/**
 * 임대차계약서 OCR 결과 3단계 (Figma node 1705:29465, 934:8698, 1720:29740 순서 그대로):
 * 1. 기본정보 확인 - 소유자·발급날짜·주소·임대차기간 (basicInfo.matchesBrokerageDocument)
 * 2. 계약 비용 확인 - 보증금·월세 (cost.depositMatched/monthlyRentMatched, 각각 따로 매칭)
 * 3. 특약사항 - riskyClauses 배열 (위험 특약이 있으면 각각 아코디언 카드로 표시)
 * matchesBrokerageDocument/depositMatched/monthlyRentMatched가 null이면(중개대상물 미등록)
 * neutral 문구로 안내한다.
 * negative(불일치) 카피는 Figma 캡처에 positive 상태만 있어서, 같은 구조로 새로 작성함.
 */
const buildResultSteps = (
  analysis: LeaseContractAnalysisResult,
): ResultStep[] => {
  const { basicInfo, cost, riskyClauses } = analysis;

  const basicInfoRows: StepRow[] = [
    { type: "info", label: "소유자", value: basicInfo.owner || "-" },
    { type: "info", label: "발급 날짜", value: basicInfo.contractDate || "-" },
    { type: "info", label: "주소", value: basicInfo.roadAddress || "-" },
    {
      type: "info",
      label: "임대차 기간",
      value: `${basicInfo.leaseStartDate || "-"}~${basicInfo.leaseEndDate || "-"}`,
    },
  ];

  const basicInfoStep: ResultStep = {
    badgeLabel: "기본정보 확인",
    status:
      basicInfo.matchesBrokerageDocument === true
        ? "positive"
        : basicInfo.matchesBrokerageDocument === false
          ? "negative"
          : "neutral",
    positive: {
      title: "소유자와 건물 주소의 기본정보를 확인했어요",
      subtitlePrefix: "기본 정보가 ",
      subtitleHighlight: "중개대상물 확인 설명서와 일치해요",
      rows: basicInfoRows,
    },
    negative: {
      title: "소유자와 건물 주소의 기본정보를 확인했어요",
      subtitlePrefix: "기본 정보가 ",
      subtitleHighlight: "중개대상물 확인 설명서와 일치하지 않아요",
      rows: [
        {
          type: "risk",
          label: "기본정보 불일치",
          statusText: "위험, 확인이 필요해요",
          description:
            "중개대상물 확인 설명서와 소유자나 주소가 다르면 실제 집주인이 맞는지, 정확한 매물인지 다시 확인해야 해요. 계약 전 반드시 공인중개사에게 이유를 물어보세요.",
        },
        ...basicInfoRows,
      ],
    },
    neutral: {
      title: "소유자와 건물 주소의 기본정보를 확인했어요",
      subtitlePrefix: "아직 등록된 중개대상물 확인 설명서가 없어 비교하지 못했어요",
      rows: basicInfoRows,
    },
  };

  // 보증금/월세는 각각 독립적으로 일치 여부가 갈릴 수 있어 단계 하나에 행을 두 개(또는
  // 월세가 없으면 하나) 섞어서 보여준다. 불일치면 위험 카드(펼치면 depositMessage 등
  // 확인 질문 표시), 일치면 "이상없음" 행, 비교 불가(중개대상물 미등록)면 안내 행.
  const costRows: StepRow[] = [];
  if (cost.depositMatched === false) {
    costRows.push({
      type: "risk",
      label: "보증금",
      statusText: "위험, 확인이 필요해요",
      description:
        cost.depositMessage ??
        "중개대상물 확인 설명서와 보증금이 다르면 계약 전 반드시 집주인이나 공인중개사에게 확인하세요.",
    });
  } else if (cost.depositMatched === true) {
    costRows.push({ type: "info", label: "보증금", value: "이상없음" });
  } else {
    costRows.push({ type: "info", label: "보증금", value: formatWon(cost.deposit) });
  }
  if (cost.monthlyRent != null) {
    if (cost.monthlyRentMatched === false) {
      costRows.push({
        type: "risk",
        label: "월세",
        statusText: "위험, 확인이 필요해요",
        description:
          cost.monthlyRentMessage ??
          "중개대상물 확인 설명서와 월세가 다르면 계약 전 반드시 집주인이나 공인중개사에게 확인하세요.",
      });
    } else if (cost.monthlyRentMatched === true) {
      costRows.push({ type: "info", label: "월세", value: "이상없음" });
    } else {
      costRows.push({
        type: "info",
        label: "월세",
        value: formatWon(cost.monthlyRent),
      });
    }
  }

  const hasCostRisk =
    cost.depositMatched === false || cost.monthlyRentMatched === false;
  const costComparable = cost.depositMatched !== null;

  const costStep: ResultStep = {
    badgeLabel: "계약 비용 확인",
    status: !costComparable ? "neutral" : hasCostRisk ? "negative" : "positive",
    positive: {
      title: "보증금, 월세를 확인했어요",
      subtitlePrefix: "중개대상물 확인 설명서와 비교한 결과, ",
      subtitleHighlight: "보증금과 월세가 모두 일치해요",
      rows: costRows,
    },
    negative: {
      title: "보증금, 월세를 확인했어요",
      subtitlePrefix: "중개대상물 확인 설명서와 비교 시 ",
      subtitleHighlight:
        cost.depositMatched === false && cost.monthlyRentMatched === false
          ? "보증금과 월세가 달라요"
          : cost.depositMatched === false
            ? "보증금이 달라요"
            : "월세가 달라요",
      rows: costRows,
    },
    neutral: {
      title: "보증금, 월세를 확인했어요",
      subtitlePrefix: "아직 등록된 중개대상물 확인 설명서가 없어 비교하지 못했어요",
      rows: costRows,
    },
  };

  const riskyClauseStep: ResultStep = {
    badgeLabel: "특약사항",
    status: riskyClauses.length > 0 ? "negative" : "positive",
    positive: {
      title: "위험한 특약사항이 발견되지 않았어요",
      subtitlePrefix:
        "원상복구 의무, 보증금 반환 조건, 관리비 추가 부담, 애완동물·흡연 등 추후 문제가 될 사항이 없는지 잘 읽어보세요",
      rows: [],
    },
    negative: {
      title: "위험한 특약사항이 발견됐어요",
      subtitlePrefix: "",
      subtitleHighlight: `${riskyClauses.length}개의 특약사항을 다시 확인해보세요`,
      rows: riskyClauses.map((clause, index) => ({
        type: "risk" as const,
        label: `특약 ${index + 1}`,
        statusText: "위험, 확인이 필요해요",
        description: `${clause.reason}\n\n원문: ${clause.originalText}\n\n제안: ${clause.suggestion}`,
      })),
    },
  };

  return [basicInfoStep, costStep, riskyClauseStep];
};

/**
 * 임대차 계약서 - 촬영한 서류 OCR/비교 결과 바텀시트
 * (Figma node 1705:29465, 934:8698, 1720:29740)
 * - 중개대상물 확인 설명서 결과 화면과 같은 흐름
 * - 1단계는 "다음으로" 단일 버튼만 표시
 * TODO: regions(하이라이트 박스)는 아직 이미지 위에 그리지 않음 - 필요해지면 추가.
 */
export default function LeaseContractResultScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;
  const [stepIndex, setStepIndex] = useState(0);
  const leaseContractAnalysis = useDocumentAnalysisStore(
    (state) => state.leaseContractAnalysis,
  );
  const resultSteps = useMemo(
    () => buildResultSteps(leaseContractAnalysis ?? FALLBACK_ANALYSIS),
    [leaseContractAnalysis],
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
              {(variant.subtitlePrefix || variant.subtitleHighlight) && (
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
              )}
            </View>

            {variant.rows.length > 0 && (
              <View className="mt-6 w-full gap-2">
                {variant.rows.map((row, index) =>
                  row.type === "risk" ? (
                    <RiskAccordionCard
                      key={`${row.label}-${index}`}
                      icon={cautionIcon}
                      label={row.label}
                      statusText={row.statusText}
                      description={row.description}
                      defaultExpanded={false}
                    />
                  ) : (
                    <ComparisonInfoRow
                      key={`${row.label}-${index}`}
                      icon={checkIcon}
                      label={row.label}
                      value={row.value}
                    />
                  ),
                )}
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
