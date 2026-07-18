import React from "react";

import MateChatScreen from "../../features/matching/components/chat/MateChatScreen";

/**
 * 부메랑 메이트 1:1 채팅방 라우트 (Figma node 1119:18918).
 * 홈 화면 BoomerangBannerCard의 "메이트 확인하기" 바텀시트 "채팅하기"에서 이리로 push한다.
 */
export default function MateChatRoute() {
  return <MateChatScreen />;
}
