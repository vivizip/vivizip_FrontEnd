import React, { useCallback, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import HeroBanner from "../../../features/ai-reviewer/components/move-in-record/HeroBanner";
import RecordListSection from "../../../features/ai-reviewer/components/move-in-record/RecordListSection";
import RecommendedTipsSection from "../../../features/ai-reviewer/components/move-in-record/RecommendedTipsSection";
import type { SortOrder } from "../../../features/ai-reviewer/components/move-in-record/RecordSortMenu";
import type { MoveInRecordCardData } from "../../../features/ai-reviewer/components/move-in-record/MoveInRecordCard";
import {
  DEFECT_TYPE_LABELS,
  listMoveInRecords,
} from "../../../features/ai-reviewer/services/moveInRecordApi";
import { useMoveInRecordStore } from "../../../features/ai-reviewer/store/useMoveInRecordStore";
import { useRegisteredHouseStore } from "../../../features/ai-reviewer/store/useRegisteredHouseStore";
import { ARTICLES } from "../../../features/ai-reviewer/articles";
import { SCREEN_PADDING } from "../../../lib/layout";
import { useToastStore } from "../../../store/useToastStore";

const backIcon = require("../../../../assets/icons/ic_left.png");

const RECOMMENDED_TIPS = ARTICLES.map(({ title, date, route }) => ({
  title,
  date,
  route,
}));

/**
 * 입주 상태 기록 목록 화면 (Figma node 1082:10171 "OFF" / 1078:9605 "ON")
 * GET /api/move-in-records를 화면 포커스 시(진입/복귀)와 정렬 변경 시 다시 조회한다.
 */
export default function MoveInRecordScreen() {
  const router = useRouter();
  const records = useMoveInRecordStore((state) => state.records);
  const setRecords = useMoveInRecordStore((state) => state.setRecords);
  const houses = useRegisteredHouseStore((state) => state.houses);
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");

  useFocusEffect(
    useCallback(() => {
      listMoveInRecords(sortOrder === "recent" ? "latest" : "oldest")
        .then(setRecords)
        .catch((err) => {
          useToastStore
            .getState()
            .show(
              err instanceof Error
                ? err.message
                : "입주 기록을 불러오지 못했어요.",
            );
        });
    }, [sortOrder, setRecords]),
  );

  const displayRecords: MoveInRecordCardData[] = records.map((record) => {
    const house = houses.find((item) => item.id === `${record.leaseCaseId}`);
    return {
      id: record.id,
      title: house?.title ?? "등록된 집",
      thumbnailUrl: record.thumbnailUrl,
      issueLabels: record.defects.map((type) => DEFECT_TYPE_LABELS[type]),
    };
  });

  const handleAddNewHouse = () => {
    router.push("/ai-reviewer/after/write-move-in-record");
  };

  const handlePressRecord = (id: number) => {
    router.push({
      pathname: "/ai-reviewer/after/move-in-record-detail",
      params: { id: String(id) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="입주 기록"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeroBanner
          hasRecords={displayRecords.length > 0}
          onAddNewHouse={handleAddNewHouse}
        />
        <RecordListSection
          records={displayRecords}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onAddNewHouse={handleAddNewHouse}
          onPressRecord={handlePressRecord}
        />
        <RecommendedTipsSection tips={RECOMMENDED_TIPS} />
      </ScrollView>
    </SafeAreaView>
  );
}
