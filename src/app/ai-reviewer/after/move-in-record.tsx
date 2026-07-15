import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import HeroBanner from "../../../features/ai-reviewer/components/move-in-record/HeroBanner";
import RecordListSection from "../../../features/ai-reviewer/components/move-in-record/RecordListSection";
import RecommendedTipsSection from "../../../features/ai-reviewer/components/move-in-record/RecommendedTipsSection";
import {
  useMoveInRecordStore,
  type MoveInRecord,
} from "../../../features/ai-reviewer/store/useMoveInRecordStore";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");

// TODO(API 대기): 실제 입주 기록 목록 API 나오기 전까지 Figma 목업과 동일한 정적 데이터 사용
const RECOMMENDED_TIPS = [
  {
    title: "입주 첫 날, 집 사진을 꼭 찍어야 하는 이유",
    date: "2026.07.04",
  },
  {
    title: "집에 문제가 생겼다면 누구에게 연락해야 할까요",
    date: "2026.07.06",
  },
];

/**
 * 입주 상태 기록 진입 화면 - 아직 작성된 기록이 없는 상태 (Figma node 1082:10171, "입주 기록 OFF")
 * TODO: 데코 일러스트(집 모양 아이콘, 빈 상태 배경 그래픽)는 생략.
 */
export default function MoveInRecordScreen() {
  const router = useRouter();
  const records = useMoveInRecordStore((state) => state.records);

  const handleAddNewHouse = () => {
    router.push("/ai-reviewer/after/write-move-in-record");
  };

  const handlePressRecord = (record: MoveInRecord) => {
    router.push({
      pathname: "/ai-reviewer/after/move-in-record-detail",
      params: { id: record.id },
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
          hasRecords={records.length > 0}
          onAddNewHouse={handleAddNewHouse}
        />
        <RecordListSection
          records={records}
          onAddNewHouse={handleAddNewHouse}
          onPressRecord={handlePressRecord}
        />
        <RecommendedTipsSection tips={RECOMMENDED_TIPS} />
      </ScrollView>
    </SafeAreaView>
  );
}
