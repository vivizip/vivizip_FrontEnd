import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const RESEND_SECONDS = 300;

export type SchoolEmailPhase = "idle" | "sent";

type Props = {
  email: string;
  onChangeEmail: (email: string) => void;
  phase: SchoolEmailPhase;
  onSendCode: () => void;
  code: string;
  onChangeCode: (code: string) => void;
  onResend: () => void;
};

const formatTime = (totalSeconds: number) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

/**
 * 부메랑 신청 온보딩 - 학교 메일 인증 콘텐츠
 * (Figma node 2243:9218 빈 입력 / 9246 이메일 입력+전송 활성 / 9275 인증코드 입력+타이머 상태).
 * TopBar/진행률바/CTA는 MatchingOnboardingStepShell이 담당하고, email/phase/code
 * 상태는 다른 단계(역할/성별/국적)와 동일하게 오케스트레이터가 들고 있다.
 * 인증코드 발송/재전송/검증은 호출부(마이페이지 SchoolVerifyScreen, 매칭 온보딩) 양쪽 모두
 * school-verification API로 실제 처리한다("다음"을 누르면 confirmSchoolVerificationCode로
 * 검증 후 다음 단계로 넘어감). "재전송"은 화면의 5분 카운트다운과 무관하게 항상 눌러서 다시
 * 요청할 수 있다 - 카운트다운은 코드 유효기간 안내용 표시일 뿐 재전송을 막는 제약이 아니다.
 */
export default function MatchingOnboardingSchoolEmailStep({
  email,
  onChangeEmail,
  phase,
  onSendCode,
  code,
  onChangeCode,
  onResend,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (phase !== "sent") return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const canSendCode = email.trim().length > 0 && phase === "idle";

  const handleSendCode = () => {
    if (!canSendCode) return;
    setSecondsLeft(RESEND_SECONDS);
    onSendCode();
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS);
    onResend();
  };

  return (
    <View className="w-full gap-11 px-4 pt-20">
      <View className="w-full gap-4">
        <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800">
          학교 메일 주소를 입력해주세요
        </Text>
        <View className="w-full gap-2">
          <TextInput
            value={email}
            onChangeText={onChangeEmail}
            editable={phase === "idle"}
            placeholder="예시) vivizip@shinhan.ac.kr"
            placeholderTextColor="#9FA5AF"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`h-12 w-full rounded-xl px-4 font-pretendard-medium text-16 font-medium ${
              phase === "sent"
                ? "bg-gray-100 text-gray-300"
                : "bg-[#EEF6FF] text-gray-700"
            }`}
          />
          <Pressable
            onPress={handleSendCode}
            disabled={!canSendCode}
            className={`h-10 w-full items-center justify-center rounded-xl ${
              canSendCode ? "bg-primary-500 active:opacity-80" : "bg-gray-50"
            }`}
            accessibilityRole="button"
            accessibilityLabel="인증코드 전송"
          >
            <Text
              className={`font-pretendard-medium text-16 font-medium ${
                canSendCode ? "text-[#F2F7FC]" : "text-gray-300"
              }`}
            >
              인증코드 전송
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="w-full gap-3">
        <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800">
          인증코드를 입력해주세요
        </Text>
        <View className="w-full gap-1">
          <TextInput
            value={code}
            onChangeText={onChangeCode}
            editable={phase === "sent"}
            placeholder="예시) 7FG8K"
            placeholderTextColor="#BFC4CC"
            autoCapitalize="characters"
            className={`h-12 w-full rounded-xl px-4 font-pretendard-medium text-16 font-medium ${
              phase === "sent"
                ? "bg-[#EEF6FF] text-gray-700"
                : "bg-gray-100 text-gray-300"
            }`}
          />
          {phase === "sent" && (
            <View className="w-full flex-row items-center justify-between">
              <View className="flex-row items-center gap-1.5">
                <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-500">
                  남은 시간
                </Text>
                <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-secondary-500">
                  {formatTime(secondsLeft)}
                </Text>
              </View>
              <Pressable onPress={handleResend} accessibilityRole="button">
                <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-500">
                  재전송
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
