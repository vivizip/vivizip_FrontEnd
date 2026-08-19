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
import { useMyProfile } from "../../../auth/hooks/useMyProfile";
import { useToastStore } from "../../../../store/useToastStore";
import {
  submitStudentOnboarding,
  submitSupporterOnboarding,
  type TimeSlotDay,
  type TimeSlotPeriod,
  type TimeSlotRequest,
} from "../../services/matchingOnboardingApi";
import { requestMatch, type MatchStatusValue } from "../../services/matchApi";
import {
  confirmSchoolVerificationCode,
  sendSchoolVerificationCode,
} from "../../services/schoolVerificationApi";
import type {
  MatchingGender,
  MatchingKoreanLevel,
  MatchingNationality,
  MatchingRole,
} from "../../types";

const KOREAN_LEVEL_TO_CODE: Record<MatchingKoreanLevel, string> = {
  greeting: "BEGINNER",
  daily: "INTERMEDIATE",
  fluent: "ADVANCED",
};

// selectedTimeSlots의 키는 "dayKey-periodKey"(예: "mon-morning", MatchingOnboardingTimeSlotStep
// 참고) 형태라, 각 부분을 대문자로 바꾸면 그대로 백엔드 day/period 코드와 일치한다.
const buildTimeSlotRequests = (slots: Set<string>): TimeSlotRequest[] =>
  Array.from(slots).map((key) => {
    const [day, period] = key.split("-");
    return {
      day: day.toUpperCase() as TimeSlotDay,
      period: period.toUpperCase() as TimeSlotPeriod,
    };
  });

const FALLBACK_SUBMIT_ERROR = "신청에 실패했어요. 다시 시도해주세요.";
const FALLBACK_SEND_CODE_ERROR = "인증코드 발송에 실패했어요. 다시 시도해주세요.";
const FALLBACK_CONFIRM_CODE_ERROR = "인증에 실패했어요. 코드를 다시 확인해주세요.";

// 진행률바가 있는 단계 수. 0~4(환영/역할/이메일/국적/성별)는 공통이고, 5단계부터
// 역할별로 갈린다 - 서포터즈는 시간대 선택(5)까지, 유학생은 한국어 수준(5)→예산(6)
// →시간대 선택(7)까지 이어진 다음 똑같이 완료 화면으로 간다.
const SUPPORTER_QUESTION_STEPS = 6;
const STUDENT_QUESTION_STEPS = 8;

// 프로필 쿼리가 아직 채워지기 전(드물게 자동 로그인 직후 등)에만 fallback 문구를 쓴다.
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
  const setLastMatch = useMatchingApplicationStore((state) => state.setLastMatch);
  const setMatchStatus = useMatchingApplicationStore(
    (state) => state.setMatchStatus,
  );
  const profile = useMyProfile().data;
  const nickname = profile?.nickname ?? FALLBACK_NICKNAME;
  // 마이페이지에서 이미 학교 인증을 마쳤으면(schoolVerified) 온보딩의 학교 메일 인증
  // 단계(index 2)를 건너뛴다 - 두 곳 다 같은 GET /api/users/me.schoolVerified를 본다.
  const isSchoolVerified = profile?.schoolVerified ?? false;
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<MatchingRole | null>(null);
  const [email, setEmail] = useState("");
  const [emailPhase, setEmailPhase] = useState<SchoolEmailPhase>("idle");
  const [emailCode, setEmailCode] = useState("");
  const [nationality, setNationality] = useState<MatchingNationality>("");
  const [gender, setGender] = useState<MatchingGender | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<string>>(
    new Set(),
  );
  const [koreanLevel, setKoreanLevel] = useState<MatchingKoreanLevel | null>(
    null,
  );
  const [deposit, setDeposit] = useState(0);
  const [rent, setRent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingSchoolCode, setIsVerifyingSchoolCode] = useState(false);

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

  // 재전송은 표시용 5분 카운트다운과 무관하게 언제든 다시 요청할 수 있다 - 실제
  // 코드 유효기간(5분) 제한은 서버(Redis TTL)가 관리하고, 프론트는 별도로 막지 않는다.
  const handleSendSchoolEmailCode = async () => {
    try {
      await sendSchoolVerificationCode(email.trim());
      setEmailPhase("sent");
      setEmailCode("");
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SEND_CODE_ERROR);
    }
  };

  const handleResendSchoolEmailCode = async () => {
    try {
      await sendSchoolVerificationCode(email.trim());
      setEmailCode("");
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SEND_CODE_ERROR);
    }
  };

  const goNext = async () => {
    if (step === 2) {
      if (isVerifyingSchoolCode) return;
      setIsVerifyingSchoolCode(true);
      try {
        await confirmSchoolVerificationCode(email.trim(), emailCode.trim());
        setStep((prev) => prev + 1);
      } catch (err) {
        useToastStore
          .getState()
          .show(
            err instanceof Error ? err.message : FALLBACK_CONFIRM_CODE_ERROR,
          );
      } finally {
        setIsVerifyingSchoolCode(false);
      }
      return;
    }
    if (isFinishStep) {
      if (isSubmitting) return;
      setIsSubmitting(true);
      try {
        const timeSlots = buildTimeSlotRequests(selectedTimeSlots);
        if (role === "student") {
          await submitStudentOnboarding({
            nationality,
            koreanLevel: koreanLevel ? KOREAN_LEVEL_TO_CODE[koreanLevel] : "",
            gender: gender ?? "",
            depositBudget: deposit,
            monthlyRentBudget: rent,
            timeSlots,
          });
          // 유학생만 매칭을 "신청"한다 - 서포터즈는 학생의 신청에 의해 매칭될 뿐
          // 직접 이 API를 호출하지 않는다.
          const match = await requestMatch();
          setLastMatch(match);
          setMatchStatus(match.status as MatchStatusValue);
        } else {
          await submitSupporterOnboarding({
            nationality,
            gender: gender ?? "",
            timeSlots,
          });
          // 서포터즈는 등록만 하고 실제 매칭은 나중에 유학생 쪽 신청으로 성사된다.
          setMatchStatus("APPLIED_NOT_MATCHED");
        }
        markApplied(role);
        router.replace("/home");
      } catch (err) {
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_SUBMIT_ERROR);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    setStep((prev) => {
      const next = prev + 1;
      return isSchoolVerified && next === 2 ? 3 : next;
    });
  };
  const goBack = () => {
    if (step === 0) {
      router.back();
      return;
    }
    setStep((prev) => {
      const back = prev - 1;
      return isSchoolVerified && back === 2 ? 1 : back;
    });
  };

  const progress = isFinishStep ? 1 : (step + 1) / questionSteps;

  const stepConfig = isFinishStep
    ? {
        question: "매칭 준비가 완료되었어요",
        subtitle: "부메랑 메이트 매칭까지는 2주 정도 소요돼요",
        ctaActive: !isSubmitting,
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
              ctaActive:
                emailPhase === "sent" &&
                emailCode.trim().length > 0 &&
                !isVerifyingSchoolCode,
              ctaLabel: isVerifyingSchoolCode ? "확인 중..." : undefined,
              content: (
                <MatchingOnboardingSchoolEmailStep
                  email={email}
                  onChangeEmail={setEmail}
                  phase={emailPhase}
                  onSendCode={handleSendSchoolEmailCode}
                  code={emailCode}
                  onChangeCode={setEmailCode}
                  onResend={handleResendSchoolEmailCode}
                />
              ),
            };
          case 3:
            return {
              question: "국적은 어디신가요?",
              ctaActive: nationality !== "",
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
