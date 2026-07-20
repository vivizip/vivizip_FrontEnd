import React, { useCallback, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";

import AddressSearchBar from "../../features/ai-reviewer/components/checklist/AddressSearchBar";
import DocumentChecklist from "../../features/ai-reviewer/components/checklist/DocumentChecklist";
import HouseSelector from "../../features/ai-reviewer/components/checklist/HouseSelector";
import ReviewTip from "../../features/ai-reviewer/components/checklist/ReviewTip";
import { useRegisteredHouseStore } from "../../features/ai-reviewer/store/useRegisteredHouseStore";
import { useTutorialSeenStore } from "../../features/ai-reviewer/store/useTutorialSeenStore";
import {
  getLeaseCaseDetail,
  getLeaseCases,
} from "../../features/ai-reviewer/services/leaseCaseApi";

export default function AiReviewerScreen() {
  const router = useRouter();
  const hasHouse = useRegisteredHouseStore((state) => state.address !== null);
  const setHouses = useRegisteredHouseStore((state) => state.setHouses);
  const tutorialSeen = useTutorialSeenStore((state) => state.seen);

  // 앱을 새로 켰을 때 등록된 집이 있어도 스토어는 빈 상태로 시작하므로, 이 탭에
  // 처음 들어올 때 한 번 실제 목록을 불러와 채운다(검색을 해야만 채워지던 문제 수정).
  useEffect(() => {
    getLeaseCases()
      .then(async (summaries) => {
        const details = await Promise.all(
          summaries.map((summary) => getLeaseCaseDetail(summary.leaseCaseId)),
        );
        const houses = details.map((detail) => ({
          id: `${detail.leaseCaseId}`,
          title: detail.roadAddress,
          subtitle: detail.detailAddress,
        }));
        // 이미 선택된 현재 집(예: 방금 confirm.tsx에서 새로 등록한 집)이 새로 불러온
        // 목록에도 있으면 그대로 유지한다 - 여기서 서버의 ACTIVE 케이스로 다시
        // 골라버리면, 여러 케이스가 ACTIVE 상태일 때 방금 등록한 집이 아닌 엉뚱한
        // leaseCaseId로 서류 분석이 나가버리는 문제가 생길 수 있다.
        const existingCurrentId =
          useRegisteredHouseStore.getState().currentHouseId;
        const keepsExisting = houses.some(
          (house) => house.id === existingCurrentId,
        );
        if (keepsExisting) {
          setHouses(houses, existingCurrentId as string);
          return;
        }
        const active =
          details.find((detail) => detail.status === "ACTIVE") ?? details[0];
        setHouses(houses, active ? `${active.leaseCaseId}` : "");
      })
      .catch((err) => {
        console.log("[AiReviewer] getLeaseCases failed:", String(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 집 미등록 + 이번 세션에서 튜토리얼을 아직 안 봤으면 튜토리얼 화면으로 안내
  useFocusEffect(
    useCallback(() => {
      if (!hasHouse && !tutorialSeen) {
        router.push("/ai-reviewer/tutorial");
      }
    }, [hasHouse, tutorialSeen, router]),
  );

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
