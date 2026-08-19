import React, { useState } from "react";
import { useRouter } from "expo-router";

import MatchingOnboardingStepShell from "../../matching/components/onboarding/MatchingOnboardingStepShell";
import MatchingOnboardingSchoolEmailStep, {
  type SchoolEmailPhase,
} from "../../matching/components/onboarding/MatchingOnboardingSchoolEmailStep";
import {
  confirmSchoolVerificationCode,
  sendSchoolVerificationCode,
} from "../../matching/services/schoolVerificationApi";
import { invalidateMyProfile } from "../../auth/hooks/useMyProfile";
import { useToastStore } from "../../../store/useToastStore";

const FALLBACK_SEND_ERROR = "인증코드 발송에 실패했어요. 다시 시도해주세요.";
const FALLBACK_CONFIRM_ERROR = "인증에 실패했어요. 다시 시도해주세요.";

/**
 * 마이페이지 "대학교 인증하기 → 인증하기" 진입 화면.
 * 부메랑 온보딩의 학교 메일 인증 단계(MatchingOnboardingSchoolEmailStep + 셸)를 그대로
 * 재사용한다 - 화면/문구가 완전히 동일한 디자인이라 중복 구현하지 않는다.
 * 인증코드 발송/확인은 school-verification API로 처리하고, 확인 성공 시
 * 프로필 쿼리 캐시를 무효화해 서버가 갱신한 schoolId/schoolVerified를 다시 불러온다
 * (confirm 응답 자체에는 이 값들이 없음).
 */
export default function SchoolVerifyScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<SchoolEmailPhase>("idle");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ctaActive = phase === "sent" && code.trim().length > 0 && !isSubmitting;

  const handleSendCode = async () => {
    try {
      await sendSchoolVerificationCode(email.trim());
      setPhase("sent");
      setCode("");
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SEND_ERROR);
    }
  };

  const handleResend = async () => {
    try {
      await sendSchoolVerificationCode(email.trim());
      setCode("");
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SEND_ERROR);
    }
  };

  const handleComplete = async () => {
    if (!ctaActive) return;
    setIsSubmitting(true);
    try {
      await confirmSchoolVerificationCode(email.trim(), code.trim());
      await invalidateMyProfile();
      router.back();
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_CONFIRM_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MatchingOnboardingStepShell
      progress={1}
      question="학교 메일을 인증해주세요"
      subtitle="안전한 매칭을 위한 단계입니다"
      onBack={() => router.back()}
      ctaActive={ctaActive}
      ctaLabel="완료"
      onNext={handleComplete}
    >
      <MatchingOnboardingSchoolEmailStep
        email={email}
        onChangeEmail={setEmail}
        phase={phase}
        onSendCode={handleSendCode}
        code={code}
        onChangeCode={setCode}
        onResend={handleResend}
      />
    </MatchingOnboardingStepShell>
  );
}
