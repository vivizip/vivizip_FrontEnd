import React from "react";
import { Tabs } from "expo-router";

import TabBar from "../../components/TabBar";

// 탭 아이콘은 TabBar.tsx의 TAB_ICONS에서 라우트 이름 기준으로 관리한다
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "홈" }} />
      <Tabs.Screen name="chat" options={{ title: "채팅" }} />
      <Tabs.Screen name="ai-reviewer" options={{ title: "서류 검토" }} />
      <Tabs.Screen name="mypage" options={{ title: "마이페이지" }} />
    </Tabs>
  );
}
