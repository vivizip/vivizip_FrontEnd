import React, { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";

import AddressSearchBar from "../../features/ai-reviewer/components/checklist/AddressSearchBar";
import DocumentChecklist from "../../features/ai-reviewer/components/checklist/DocumentChecklist";
import HouseSelector from "../../features/ai-reviewer/components/checklist/HouseSelector";
import ReviewTip from "../../features/ai-reviewer/components/checklist/ReviewTip";

export default function AiReviewerScreen() {
  const router = useRouter();

  // 이 화면은 상단 배경이 파란색이라 상태바 아이콘을 흰색으로, 벗어나면 원복
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-400" edges={["top"]}>
      {/* 상단 파란 영역: 집 선택 + 주소 검색 + 팁 */}
      {/* px-4 = 16px (Tailwind 숫자는 4px 단위: p-4=16px, p-6=24px, p-16=64px) */}
      <View className="gap-4 px-4 pb-6 pt-8">
        <HouseSelector />
        {/* 검색창 ↔ 팁 간격은 10px (Figma) */}
        <View className="gap-[10px]">
          <AddressSearchBar
            onPress={() => router.push("/ai-reviewer/search")}
          />
          <ReviewTip />
        </View>
      </View>

      {/* 흰색 시트: 단계별 문서 체크리스트 */}
      <ScrollView
        className="flex-1 rounded-t-3xl bg-white"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 120, // 플로팅 탭바에 가리지 않도록
        }}
        showsVerticalScrollIndicator={false}
      >
        <DocumentChecklist />
      </ScrollView>
    </SafeAreaView>
  );
}
