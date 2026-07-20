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
import MatchingOnboardingTimeSlotStep from "./MatchingOnboardingTimeSlotStep";
import MatchingOnboardingKoreanLevelStep from "./MatchingOnboardingKoreanLevelStep";
import MatchingOnboardingBudgetStep from "./MatchingOnboardingBudgetStep";
import MatchingOnboardingFinishStep from "./MatchingOnboardingFinishStep";
import { useMatchingApplicationStore } from "../../store/useMatchingApplicationStore";
import { useAuthUserStore } from "../../../auth/store/useAuthUserStore";
import type {
  MatchingGender,
  MatchingKoreanLevel,
  MatchingNationality,
  MatchingRole,
} from "../../types";

// 진행률바가 있는 단계 수. 0~4(환영/역할/이메일/국적/성별)는 공통이고, 5단계부터
// 역할별로 갈린다 - 서포터즈는 시간대 선택(5)까지, 유학생은 한국어 수준(5)→예산(6)
// →시간대 선택(7)까지 이어진 다음 똑같이 완료 화면으로 간다.
const SUPPORTER_QUESTION_STEPS = 6;
const STUDENT_QUESTION_STEPS = 8;

// TODO(내 정보 조회 API 미구현): 자동 로그인(토큰만 있고 로그인 응답이 없는 경우) 시
// useAuthUserStore.user가 비어있을 수 있어 그 경우에만 fallback 문구를 쓴다.
const FALLBACK_NICKNAME = "회원";

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
 * 1단계에서 고른 역할(서포터즈/유학생)에 따라 5단계부터 화면이 갈린다:
 * 서포터즈는 시간대 선택(5) 하나뿐이고, 유학생은 한국어 수준(5) → 예산(6) →
 * 시간대 선택(7) 세 단계를 거친다. 마지막 시간대 선택 다음에는 두 역할 모두
 * 동일한 완료 화면(FINISH_STEP)으로 이어진다.
 */
export default function MatchingOnboardingScreen() {
  const router = useRouter();
  const markApplied = useMatchingApplicationStore((state) => state.markApplied);
  const nickname =
    useAuthUserStore((state) => state.user?.nickname) ?? FALLBACK_NICKNAME;
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<MatchingRole | null>(null);
  const [email, setEmail] = useState("");
  const [emailPhase, setEmailPhase] = useState<SchoolEmailPhase>("idle");
  const [emailCode, setEmailCode] = useState("");
  const [nationality, setNationality] = useState<MatchingNationality>("korea");
  const [gender, setGender] = useState<MatchingGender | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<string>>(
    new Set(),
  );
  const [koreanLevel, setKoreanLevel] = useState<MatchingKoreanLevel | null>(
    null,
  );
  const [deposit, setDeposit] = useState(0);
  const [rent, setRent] = useState(0);

  const questionSteps =
    role === "student" ? STUDENT_QUESTION_STEPS : SUPPORTER_QUESTION_STEPS;
  const finishStep = questionSteps;

  const toggleTimeSlot = (key: string) => {
    setSelectedTimeSlots((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isFinishStep = step === finishStep;

  const goNext = () => {
    if (isFinishStep) {
      markApplied(role);
      router.replace("/home");
      return;
    }
    setStep((prev) => prev + 1);
  };
  const goBack = () => {
    if (step === 0) {
      router.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const progress = isFinishStep ? 1 : (step + 1) / questionSteps;

  const stepConfig = isFinishStep
    ? {
        question: "매칭 준비가 완료되었어요",
        subtitle: "부메랑 메이트 매칭까지는 2주 정도 소요돼요",
        ctaActive: true,
        ctaLabel: "완료",
        content: <MatchingOnboardingFinishStep />,
      }
    : (() => {
        switch (step) {
          case 0:
            return {
              question: (
                <>
                  안녕하세요{" "}
                  <Text className="text-primary-500">{nickname}</Text>님
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
                <MatchingOnboardingRoleStep
                  role={role}
                  onSelectRole={setRole}
                />
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
          case 4:
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
          case 5:
            if (role === "student") {
              return {
                question: (
                  <>
                    한국어로 대화하는 것이{"\n"}어느 정도 편한가요?
                  </>
                ),
                ctaActive: koreanLevel !== null,
                content: (
                  <MatchingOnboardingKoreanLevelStep
                    level={koreanLevel}
                    onSelectLevel={setKoreanLevel}
                  />
                ),
              };
            }
            return {
              question: "활동 가능한 시간대를 모두 선택해주세요",
              subtitle: "겹치는 시간대를 우선적으로 매칭해드려요",
              ctaActive: selectedTimeSlots.size > 0,
              content: (
                <MatchingOnboardingTimeSlotStep
                  selected={selectedTimeSlots}
                  onToggle={toggleTimeSlot}
                />
              ),
            };
          case 6:
            // 유학생 전용(서포터즈는 finishStep이 6이라 위쪽 isFinishStep 분기에서 처리됨).
            return {
              question: "어떤 조건의 집을 찾고있나요?",
              subtitle: "예산을 입력해주세요",
              ctaActive: deposit > 0 && rent > 0,
              content: (
                <MatchingOnboardingBudgetStep
                  deposit={deposit}
                  rent={rent}
                  onChangeDeposit={setDeposit}
                  onChangeRent={setRent}
                />
              ),
            };
          default:
            // 유학생 전용 마지막 질문 단계(7) - 서포터즈와 동일한 시간대 선택 화면 재사용.
            return {
              question: "활동 가능한 시간대를 모두 선택해주세요",
              subtitle: "겹치는 시간대를 우선적으로 매칭해드려요",
              ctaActive: selectedTimeSlots.size > 0,
              content: (
                <MatchingOnboardingTimeSlotStep
                  selected={selectedTimeSlots}
                  onToggle={toggleTimeSlot}
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
      ctaLabel={"ctaLabel" in stepConfig ? stepConfig.ctaLabel : undefined}
      onNext={goNext}
    >
      {stepConfig.content}
    </MatchingOnboardingStepShell>
  );
}
