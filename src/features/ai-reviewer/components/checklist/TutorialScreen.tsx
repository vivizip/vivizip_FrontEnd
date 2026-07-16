import React, { useCallback, useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";

import AddressSearchBar from "./AddressSearchBar";
import DocumentChecklist from "./DocumentChecklist";
import DocumentItem from "./DocumentItem";
import HouseSelector from "./HouseSelector";
import ReviewTip from "./ReviewTip";
import { DOCUMENT_STEPS } from "../../constants";
import { useTutorialSeenStore } from "../../store/useTutorialSeenStore";
import ArrowIcon from "../../../../../assets/icons/ic_tutorial_arrow.svg";
import CursorIcon from "../../../../../assets/icons/ic_tutorial_cursor.svg";

const searchIcon = require("../../../../../assets/icons/iconoir_search.png");

const previewItems = DOCUMENT_STEPS[0].items;

// 아래 좌표는 베이스 레이어(ai-reviewer.tsx와 동일한 레이아웃)의 실측값:
// 헤더 pt-8(32) + HouseSelector(26) + gap-4(16) = 주소 검색창 시작 74, 높이 40(py-2×2+24).
const ADDRESS_BAR_TOP = 74;
const ADDRESS_BAR_BOTTOM = ADDRESS_BAR_TOP + 40;
// 헤더 전체 높이 = 74 + 40 + gap-[10px](10) + ReviewTip(64) + pb-6(24) = 212.
// 흰 시트의 ScrollView paddingTop(32)을 더한 지점부터 "계약 전" 1단계가 시작된다.
const PREVIEW_TOP = 212 + 32;

/**
 * 서류홈 튜토리얼 화면 (Figma node 1884:21421).
 * ai-reviewer 탭과 동일한 레이아웃을 베이스로 깔고 전체를 어둡게 덮은 뒤,
 * 주소 검색창(예시 주소 입력 상태) / 안내 툴팁 / "계약 전" 1단계 활성 미리보기만
 * 밝게 띄워서 "주소를 먼저 검색해야 기능이 열린다"는 흐름을 안내한다.
 * 화면 아무 곳이나 터치하면 닫히고, 세션 내에서는 다시 뜨지 않는다.
 */
export default function TutorialScreen() {
  const router = useRouter();
  const markSeen = useTutorialSeenStore((state) => state.markSeen);

  // 진입 즉시 "봤음" 처리 - 닫고 돌아간 ai-reviewer 탭이 다시 리다이렉트하지 않도록
  useEffect(() => {
    markSeen();
  }, [markSeen]);

  // 어두운 화면이라 상태바 아이콘을 흰색으로, 벗어나면 원복 (ai-reviewer.tsx와 동일 패턴)
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("dark");
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-primary-400" edges={["top"]}>
      {/* 베이스 레이어: 실제 ai-reviewer 탭과 동일한 화면 (집 미등록 상태라 전부 비활성) */}
      <View className="gap-4 px-4 pb-6 pt-8">
        <HouseSelector />
        <View className="gap-[10px]">
          <AddressSearchBar />
          <ReviewTip />
        </View>
      </View>
      <ScrollView
        className="flex-1 rounded-t-3xl bg-white"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      >
        <DocumentChecklist />
      </ScrollView>

      {/* 딤 레이어 + 하이라이트: 아무 곳이나 터치하면 닫힘 */}
      <Pressable
        onPress={() => router.back()}
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(18,22,25,0.85)" }}
        accessibilityRole="button"
        accessibilityLabel="튜토리얼 닫기"
      >
        {/* 주소 검색창 (예시 주소가 입력된 상태) */}
        <View
          pointerEvents="none"
          className="absolute left-4 right-4 h-10 flex-row items-center justify-between rounded-2xl bg-white px-3 py-2 mt-[21px]"
          style={{ top: ADDRESS_BAR_TOP }}
        >
          <View className="flex-row items-center">
            <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-400">
              스퀘어 브릿지 빌라
            </Text>
            {/* 입력 커서 연출 */}
            <View className="ml-0.5 h-[18px] w-px bg-gray-600" />
          </View>
          <Image
            source={searchIcon}
            className="h-6 w-6"
            resizeMode="contain"
            style={{ tintColor: "#9FA5AF" }}
          />
        </View>

        {/* 검색창 아래에서 안내 툴팁 첫 줄을 가리키는 점선 화살표 (Figma 38x41) */}
        {/* 검색창이 mt-5(20px)만큼 내려가 있어서 그만큼 보정: 검색창 실제 하단(134)보다 7px 위에서 시작 */}
        <View
          className="absolute left-2"
          style={{ top: ADDRESS_BAR_BOTTOM + 7 }}
        >
          <ArrowIcon width={38} height={41} />
        </View>

        {/* 안내 툴팁 */}
        <View
          pointerEvents="none"
          className="absolute left-[48px] w-[293px] gap-0.5"
          style={{ top: ADDRESS_BAR_BOTTOM + 30 }}
        >
          <Text className="font-pretendard-medium text-14 font-medium leading-5 text-primary-500">
            주소를 입력해야 계약 전 서류 분석 기능이 활성화돼요
          </Text>
          <Text className="font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-200">
            가장 먼저 주소를 검색해 주세요
          </Text>
        </View>

        {/* "계약 전" 1단계 활성 미리보기 (DocumentChecklist 활성 스타일 재사용) */}
        <View
          pointerEvents="none"
          className="absolute left-6 right-6 flex-row gap-3"
          style={{ top: PREVIEW_TOP }}
        >
          <View className="items-center">
            <View className="h-6 w-6 items-center justify-center rounded-[500px] bg-primary-500">
              <Text className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-[#F2F7FC]">
                1
              </Text>
            </View>
          </View>
          <View className="flex-1 gap-3">
            <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-[#F2F7FC] mt-[5px] ml-[3px]">
              계약전
            </Text>
            <View className="overflow-hidden rounded-xl bg-[#F2F7FC] mr-[4px] ml-[4px]">
              {previewItems.map((item, index) => (
                <DocumentItem
                  key={item.id}
                  name={item.name}
                  isLast={index === previewItems.length - 1}
                  isActive
                  chipLabel="발급하기"
                />
              ))}
            </View>
            {/* 두 번째 항목(건축물대장)을 가리키는 커서 아이콘 */}
            <View className="absolute left-[150px] top-[130px]">
              <CursorIcon width={40} height={40} />
            </View>
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
