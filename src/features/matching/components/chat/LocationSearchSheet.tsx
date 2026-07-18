import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import SearchInput from "../../../../components/SearchInput";
import SearchResultList from "../../../ai-reviewer/components/search/SearchResultList";
import type { AddressSearchResult } from "../../../ai-reviewer/components/search/SearchResultItem";

// TODO(장소 검색 API 미구현): 지도/장소 검색 연동 전까지 Figma 목업 결과를 그대로 사용.
const MOCK_PLACE_RESULTS: AddressSearchResult[] = [
  { title: "명동역 8번출구", description: "서울특별시 중구 수표로 13-1" },
  { title: "명동 감자면가", description: "서울 중구 충무로1가 24-18" },
  { title: "명동 신한 익스페이스", description: "서울 중구 충무로1가 24-18" },
  {
    title: "명동 써브웨이 명동성당점",
    description: "서울 중구 충무로1가 24-18",
  },
];

type Props = {
  onSelect: (location: string) => void;
};

/**
 * "약속잡기" 시트의 "장소" 행에서 여는 주소 검색 바텀시트
 * (Figma node 1119:17398 하단, "약속잡기_주소검색 바텀시트").
 * ai-reviewer 도메인의 SearchResultList/SearchResultItem을 그대로 재사용하고,
 * 입력창은 AddressSearchBar(터치 전용 트리거) 대신 실제 편집 가능한 공용 SearchInput을 쓴다
 * - Figma의 배경/패딩 스펙도 SearchInput 쪽과 일치한다.
 * 장소명 옆 카테고리 라벨(예: "서울4호선 출구번호")은 SearchResultItem이 지원하지 않아 생략했다.
 */
export default function LocationSearchSheet({ onSelect }: Props) {
  const [query, setQuery] = useState("명동");

  return (
    <View className="w-full flex-1 items-center gap-5 rounded-t-2xl bg-white pb-5 pt-2.5">
      <View className="h-1 w-14 rounded-full bg-gray-100" />

      <View className="w-full px-4">
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="장소를 검색하세요"
        />
      </View>

      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingHorizontal: 32, gap: 8 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchResultList
          results={MOCK_PLACE_RESULTS}
          query={query}
          onSelect={(result) => onSelect(result.title)}
        />
      </ScrollView>
    </View>
  );
}
