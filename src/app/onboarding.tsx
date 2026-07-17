import React from "react";

import OnboardingScreen from "../features/onboarding/components/OnboardingScreen";

/**
 * 로그인 직후 첫 진입 온보딩 튜토리얼 라우트 (Figma node 1212:14974 ~ 1212:15044).
 * 로그인/비회원 진입 버튼이 hasSeenOnboarding()으로 분기해서 이리로 replace한다.
 */
export default function OnboardingRoute() {
  return <OnboardingScreen />;
}
