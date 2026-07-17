import React, { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";

import MatchingOnboardingStepShell from "./MatchingOnboardingStepShell";
import MatchingOnboardingWelcomeStep from "./MatchingOnboardingWelcomeStep";
import MatchingOnboardingRoleStep from "./MatchingOnboardingRoleStep";
import MatchingOnboardingSchoolEmailStep, {
  type SchoolEmailPhase,
} from "./MatchingOnboardingSchoolEmailStep";
import MatchingOnboardingNationalityStep from "./MatchingOnboardingNationalityStep";
import MatchingOnboardingGenderStep from "./MatchingOnboardingGenderStep";
import type { MatchingGender, MatchingNationality, MatchingRole } from "../types";

// 지금까지 확인된 공용(서포터즈/유학생 공통) 단계 수 - 역할 선택 이후 실제로는
// 서포터즈용/유학생용 단계가 더 이어질 예정이라 아직 정확한 전체 단계 수는 아님.
// 그 화면들을 받으면 이 값과 진행률 계산을 다시 맞출 것.
const KNOWN_SHARED_STEPS = 5;

// TODO(닉네임 연동 필요): 로그인 응답(KakaoLoginResponse.nickname)을 전역에서 조회할 방법이
// 아직 없어 목업 표시. 사용자 정보 저장소가 생기면 실제 닉네임으로 교체할 것.
const MOCK_NICKNAME = "은수";

/**
 * 부메랑 신청 온보딩 흐름 (환영 → 역할 선택 → 학교 메일 인증 → 국적 → 성별).
 * BoomerangIntroScreen의 "신청하러 가기"에서 진입한다.
 *
 * 모든 단계가 TopBar·진행률바·CTA를 MatchingOnboardingStepShell 하나로 계속
 * 유지한 채 가운데 콘텐츠 컴포넌트만 바꿔치기한다 - 그래야 다음으로 넘어갈 때
 * 셸이 리마운트되지 않아 자연스럽게 이어진다. 배경은 모든 단계 흰색으로 통일.
 *
 * 진행률 바는 Figma 픽셀값이 단계마다 들쭉날쭉(여러 단계가 같은 값)해서 그대로 베끼지
 * 않고 (현재 단계+1)/KNOWN_SHARED_STEPS로 계산해서 쓴다.
 *
 * 1단계에서 고른 역할(서포터즈/유학생)에 따라 이 5단계 이후 화면이 갈릴 예정이나,
 * 아직 그 다음 화면 디자인을 받지 못해 공용 단계(환영/역할/이메일/국적/성별)까지만 구현함.
 */
export default function MatchingOnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<MatchingRole | null>(null);
  const [email, setEmail] = useState("");
  const [emailPhase, setEmailPhase] = useState<SchoolEmailPhase>("idle");
  const [emailCode, setEmailCode] = useState("");
  const [nationality, setNationality] = useState<MatchingNationality>("korea");
  const [gender, setGender] = useState<MatchingGender | null>(null);

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const progress = (step + 1) / KNOWN_SHARED_STEPS;

  const stepConfig = (() => {
    switch (step) {
      case 0:
        return {
          question: (
            <>
              안녕하세요{" "}
              <Text className="text-primary-500">{MOCK_NICKNAME}</Text>님
              {"\n"}부메랑에 합류하신 걸 환영해요
            </>
          ),
          ctaActive: true,
          content: <MatchingOnboardingWelcomeStep />,
        };
      case 1:
        return {
          question: "부메랑에서 맡은 역할을 선택해주세요",
          ctaActive: role !== null,
          content: (
            <MatchingOnboardingRoleStep role={role} onSelectRole={setRole} />
          ),
        };
      case 2:
        return {
          question: "학교 메일을 인증해주세요",
          subtitle: "안전한 매칭을 위한 단계입니다",
          ctaActive: emailPhase === "sent" && emailCode.trim().length > 0,
          content: (
            <MatchingOnboardingSchoolEmailStep
              email={email}
              onChangeEmail={setEmail}
              phase={emailPhase}
              onSendCode={() => {
                setEmailPhase("sent");
                setEmailCode("");
              }}
              code={emailCode}
              onChangeCode={setEmailCode}
              onResend={() => setEmailCode("")}
            />
          ),
        };
      case 3:
        return {
          question: "국적은 어디신가요?",
          ctaActive: true,
          content: (
            <MatchingOnboardingNationalityStep
              nationality={nationality}
              onSelectNationality={setNationality}
            />
          ),
        };
      default:
        return {
          question: "성별은 무엇인가요?",
          ctaActive: gender !== null,
          content: (
            <MatchingOnboardingGenderStep
              gender={gender}
              onSelectGender={setGender}
            />
          ),
        };
    }
  })();

  return (
    <MatchingOnboardingStepShell
      progress={progress}
      question={stepConfig.question}
      subtitle={"subtitle" in stepConfig ? stepConfig.subtitle : undefined}
      onBack={goBack}
      ctaActive={stepConfig.ctaActive}
      onNext={goNext}
    >
      {stepConfig.content}
    </MatchingOnboardingStepShell>
  );
}
