import React from "react";
import { Text, TextInput, View } from "react-native";

const formatManwon = (value: number) => value.toLocaleString("ko-KR");

type BudgetFieldProps = {
  label: string;
  description: string;
  value: number;
  onChangeValue: (value: number) => void;
};

function BudgetField({
  label,
  description,
  value,
  onChangeValue,
}: BudgetFieldProps) {
  const handleChangeText = (text: string) => {
    const digitsOnly = text.replace(/[^0-9]/g, "");
    onChangeValue(digitsOnly.length > 0 ? Number(digitsOnly) : 0);
  };

  return (
    <View className="w-full gap-3">
      <View className="w-full gap-1">
        <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800">
          {label}
        </Text>
        <Text className="font-pretendard text-12 leading-4 text-gray-500">
          {description}
        </Text>
      </View>
      <View className="w-full gap-1 rounded-xl bg-[#EEF6FF] px-4 py-3">
        <View className="w-full flex-row items-center gap-1">
          <TextInput
            value={value > 0 ? formatManwon(value) : ""}
            onChangeText={handleChangeText}
            placeholder="0"
            placeholderTextColor="#9FA5AF"
            keyboardType="number-pad"
            className="font-pretendard-semibold text-18 font-semibold text-gray-800"
          />
          <Text className="font-pretendard-semibold text-18 font-semibold text-gray-800">
            원
          </Text>
        </View>
        <Text className="font-pretendard text-12 leading-[18px] text-gray-400">
          {formatManwon(Math.floor(value / 10000))} 만원
        </Text>
      </View>
    </View>
  );
}

type Props = {
  deposit: number;
  rent: number;
  onChangeDeposit: (value: number) => void;
  onChangeRent: (value: number) => void;
};

/**
 * 부메랑 신청 온보딩(유학생) - 예산(보증금/월세) 입력 콘텐츠
 * (Figma node 1883:31536 미입력, 1883:31504 입력 상태).
 * Figma 목업 캡션은 "1천 만원"/"육십 만원"처럼 서로 다른 한글 표기 방식이 섞여있어
 * (하나는 숫자+한자 단위, 하나는 완전 한글 읽기) 일관된 변환 규칙으로 보기 어렵다.
 * 기존 LoanCalcSheet.tsx의 관례(toLocaleString 콤마 포맷 + "만원")를 그대로 따른다.
 */
export default function MatchingOnboardingBudgetStep({
  deposit,
  rent,
  onChangeDeposit,
  onChangeRent,
}: Props) {
  return (
    <View className="w-full gap-14 px-4 pt-16">
      <BudgetField
        label="보증금"
        description="집을 빌릴 때 맡기는 돈이에요. 계약이 끝나면 돌려받을 수 있어요."
        value={deposit}
        onChangeValue={onChangeDeposit}
      />
      <BudgetField
        label="월세"
        description="집에 사는 동안 매달 집주인에게 내는 비용이에요."
        value={rent}
        onChangeValue={onChangeRent}
      />
    </View>
  );
}
