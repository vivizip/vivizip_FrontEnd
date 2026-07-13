import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  homePrice: number;
  maxClaimAmount: number;
  depositDraft: number;
  onAddDeposit: (amount: number) => void;
  onCalculate: () => void;
};

const QUICK_ADD_AMOUNTS = [100, 500, 1000];

const formatManwon = (value: number) => value.toLocaleString("ko-KR");

/**
 * "직접 입력하기" 바텀시트 - 근저당권 위험도 계산 (Figma node 993:31043)
 * - 프레임: padding 32px(top) 16px(x) 28px(bottom), gap 28px, radius 16px(top only), bg #FFF
 *   (하단 패딩은 기기 제스처 바에 "계산하기" 버튼이 가리지 않도록 Figma 28px에서 70px로 보정)
 * - 집의 시세/채권최고액은 읽기전용(gray-900), 내 보증금만 편집 가능(gray-500 + 밑줄)
 * - 카드 자체만 그린다. 오버레이/슬라이드업 애니메이션은 호출부(LoanRiskSection)에서 처리.
 * - Figma 목업은 단위를 "원"으로 썼지만 화면 전체 데이터 단위(만원)와 맞춰 "만원"으로 표기
 */
export default function LoanCalcSheet({
  homePrice,
  maxClaimAmount,
  depositDraft,
  onAddDeposit,
  onCalculate,
}: Props) {
  return (
    <View className="w-full flex-col items-center gap-7 rounded-t-2xl bg-white px-4 pb-[70px] pt-8">
      <View className="w-full items-start">
        <Text className="text-title-m text-gray-900">근저당권 위험도 계산</Text>
      </View>

      <View className="w-full gap-5">
        <View className="w-full flex-row items-center gap-4">
          <Text className="w-16 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
            집의 시세
          </Text>
          <View className="flex-1 flex-row items-center justify-end gap-2">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
              {formatManwon(homePrice)}
            </Text>
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
              만원
            </Text>
          </View>
        </View>

        <View className="w-full flex-row items-center gap-4">
          <Text className="w-16 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
            채권최고액
          </Text>
          <View className="flex-1 flex-row items-center justify-end gap-2">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
              {formatManwon(maxClaimAmount)}
            </Text>
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
              만원
            </Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <View className="w-full flex-row items-center gap-4">
            <Text className="w-16 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
              내 보증금
            </Text>
            <View className="flex-1 flex-col items-end gap-1">
              <View className="w-full flex-row items-center justify-end gap-2">
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-500">
                  {formatManwon(depositDraft)}
                </Text>
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
                  만원
                </Text>
              </View>
              <View className="h-px w-full bg-[#D9D9D9]" />
            </View>
          </View>

          <View className="w-full flex-row items-center justify-between">
            {QUICK_ADD_AMOUNTS.map((amount) => (
              <Pressable
                key={amount}
                onPress={() => onAddDeposit(amount)}
                className="w-[106px] items-center justify-center rounded-lg bg-gray-50 px-3 py-1 active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel={`${amount}만원 추가`}
              >
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-400">
                  +{formatManwon(amount)}만
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <Pressable
        onPress={onCalculate}
        className="h-11 w-full items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel="계산하기"
      >
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-white">
          계산하기
        </Text>
      </Pressable>
    </View>
  );
}
