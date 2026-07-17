import React from "react";
import { KeyboardAvoidingView, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TopBar from "../../../components/TopBar";
import CTAButton from "../../../components/CTAButton";
import MatchingOnboardingProgressBar from "./MatchingOnboardingProgressBar";

const backIcon = require("../../../../assets/icons/ic_left.png");

type Props = {
  progress: number;
  question: React.ReactNode;
  subtitle?: string;
  onBack: () => void;
  ctaActive: boolean;
  onNext: () => void;
  children: React.ReactNode;
};

/**
 * 부메랑 신청 온보딩의 단계 공통 셸 (TopBar + 진행률 바 + 질문 + 내용 + "다음" CTA).
 * 환영/역할/이메일 인증/국적/성별 단계 전부가 이 구조를 공유한다.
 * 배경은 모든 단계가 흰색으로 통일한다.
 * 콘텐츠 영역(진행률바+질문+children)만 KeyboardAvoidingView+ScrollView로 감싸서,
 * 키보드가 올라오면 포커스된 입력칸(학교 메일 인증 단계의 인증코드 등)이 자동으로
 * 스크롤되어 보이게 한다. CTA 버튼은 이 KeyboardAvoidingView 밖(SafeAreaView 바로
 * 아래)에 둬서 키보드가 올라와도 버튼 위치 자체는 화면 하단에 그대로 고정된다.
 * behavior="height"는 안드로이드에서 잘 안 먹는 경우가 있어 두 플랫폼 다 "padding"으로 통일.
 */
export default function MatchingOnboardingStepShell({
  progress,
  question,
  subtitle,
  onBack,
  ctaActive,
  onNext,
  children,
}: Props) {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <TopBar title="" leftIcon={backIcon} onPressLeft={onBack} />

        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MatchingOnboardingProgressBar progress={progress} />

            <View className="w-full items-center gap-1 px-4 pt-9">
              <Text className="w-full font-pretendard-semibold text-20 font-semibold leading-7 text-black">
                {question}
              </Text>
              {subtitle && (
                <Text className="w-full font-pretendard-medium text-16 font-medium leading-6 text-gray-500">
                  {subtitle}
                </Text>
              )}
            </View>

            {children}
          </ScrollView>
        </KeyboardAvoidingView>

        <View className="w-full px-4 pb-3">
          <CTAButton
            label="다음"
            active={ctaActive}
            onPress={onNext}
            heightClassName="h-11"
            radiusClassName="rounded-2xl"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
