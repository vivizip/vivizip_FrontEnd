import React from "react";
import { Stack } from "expo-router";

import TutorialScreen from "../../features/ai-reviewer/components/checklist/TutorialScreen";

/**
 * 서류홈 튜토리얼 라우트 (Figma node 1884:21421).
 * 집 미등록 상태로 ai-reviewer 탭에 처음 진입하면 (tabs)/ai-reviewer.tsx가 이리로 push한다.
 * 실제 화면 위에 얹힌 오버레이처럼 보이도록 기본 슬라이드 전환 대신 fade로 오간다.
 */
export default function TutorialRoute() {
  return (
    <>
      <Stack.Screen options={{ animation: "fade" }} />
      <TutorialScreen />
    </>
  );
}
