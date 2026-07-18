import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";

import OnboardingIntroStep from "./OnboardingIntroStep";
import OnboardingStageStep from "./OnboardingStageStep";
import OnboardingFinishStep from "./OnboardingFinishStep";
import { markOnboardingSeen } from "../lib/onboardingStorage";

import Tutorial1Illustration from "../../../../assets/images/img_onboarding_stage1.svg";
import Tutorial2Illustration from "../../../../assets/images/img_onboarding_stage2.svg";
import Tutorial3Illustration from "../../../../assets/images/img_onboarding_stage3.svg";

const TOTAL_STEPS = 5;

/**
 * 로그인 직후 뜨는 5단계 온보딩 튜토리얼 (Figma node 1212:14974 ~ 1212:15044).
 * 마운트 시 온보딩을 "봤음" 처리해서 기기에서 다시 안 뜨게 한다.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // TODO(테스트용 임시 비활성화): 로그인할 때마다 온보딩이 계속 뜨는지 확인하기 위해
    // markOnboardingSeen() 호출을 잠시 꺼둠 - 테스트 끝나면 아래 줄 주석 해제할 것.
    // markOnboardingSeen();
  }, []);

  const goNext = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  const goHome = () => router.replace("/home");
  const goMatchFriends = () => router.push("/matching/onboarding");

  switch (step) {
    case 0:
      return <OnboardingIntroStep onNext={goNext} />;
    case 1:
      return (
        <OnboardingStageStep
          badgeLabel="같은 학교 친구와 함께 안전하게 집 구하기"
          activeStage={1}
          title={
            <>
              <Text className="text-primary-500">부메랑 매칭 시스템</Text>을
              통해{"\n"}같은 학교 친구와 약속을 잡고{"\n"}부동산에 방문해요
            </>
          }
          illustration={<Tutorial1Illustration width={300} height={300} />}
          caption="지푸라기로 초기 집을 짓는 첫째돼지 단계"
          tip="친구에게 원하는 보증금 정도나 지역을 미리 채팅으로 설명해주면 더 쉽고 빠르게 부동산에서 매물을 찾을 수 있어요"
          onNext={goNext}
        />
      );
    case 2:
      return (
        <OnboardingStageStep
          badgeLabel="AI 서류분석으로 계약 관련 서류 살피기"
          activeStage={2}
          title={
            <>
              뚝딱뚝딱, <Text className="text-primary-500">AI서류 분석</Text>
              으로{"\n"}계약 전 안전성을 검증해요
            </>
          }
          illustration={<Tutorial2Illustration width={300} height={300} />}
          caption="나무로 집의 토대를 세우는 둘째돼지 단계"
          tip="계약서 작성 전 비교해보아야 하는 등기부등본, 건출물토지교차 비교로 안전성을 검증하고 최종 계약서까지 한번에 확인하세요"
          onNext={goNext}
        />
      );
    case 3:
      return (
        <OnboardingStageStep
          badgeLabel="입주사진 기록과 입주 관련 아티클 확인"
          activeStage={3}
          title={
            <>
              행복한 우리집이 생겼어요!{"\n"}구석구석{" "}
              <Text className="text-primary-500">입주 사진을 기록</Text>해요
            </>
          }
          illustration={<Tutorial3Illustration width={300} height={300} />}
          caption="튼튼한 벽돌집을 완성한 셋째돼지 단계"
          tip="이사 직후 집의 모습과 나갈 때의 모습이 일치해야 집에 문제가 생겼을 때 집주인에게 증거로 제시할 수 있어요"
          onNext={goNext}
        />
      );
    default:
      return (
        <OnboardingFinishStep
          onGoHome={goHome}
          onMatchFriends={goMatchFriends}
        />
      );
  }
}
