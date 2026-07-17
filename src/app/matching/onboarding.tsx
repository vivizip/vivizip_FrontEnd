import React from "react";

import MatchingOnboardingScreen from "../../features/matching/components/MatchingOnboardingScreen";

/**
 * 부메랑 신청 온보딩 라우트 (Figma node 1879:30488).
 * BoomerangIntroScreen(/matching/intro)의 "신청하러 가기"에서 이리로 push한다.
 */
export default function MatchingOnboardingRoute() {
  return <MatchingOnboardingScreen />;
}
