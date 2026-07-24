import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

import SearchInput from "../../../../components/SearchInput";
import SearchResultList from "../../../ai-reviewer/components/search/SearchResultList";
import type { AddressSearchResult } from "../../../ai-reviewer/components/search/SearchResultItem";
import { searchPlaces } from "../../../ai-reviewer/services/placesApi";
import { useToastStore } from "../../../../store/useToastStore";

export type SelectedPlace = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type Props = {
  onSelect: (place: SelectedPlace) => void;
};

// 검색어 입력마다 API를 호출하지 않도록 타이핑이 멈춘 뒤에만 호출 (search.tsx와 동일한 값)
const SEARCH_DEBOUNCE_MS = 300;

/**
 * "약속잡기" 시트의 "장소" 행에서 여는 주소 검색 바텀시트
 * (Figma node 1119:17398 하단, "약속잡기_주소검색 바텀시트").
 * ai-reviewer 도메인의 SearchResultList/SearchResultItem + 집 주소 검색(search.tsx)에서
 * 이미 연동된 GET /api/places/search를 그대로 재사용한다. 결과의 title은 장소명, description은
 * 도로명 주소로 매핑해 약속 생성 API가 요구하는 placeName/placeAddress/좌표를 그대로 얻는다.
 */
export default function LocationSearchSheet({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressSearchResult[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchPlaces({ query: trimmed })
        .then((res) => {
          setResults(
            res.places.map((place) => ({
              title: place.placeName,
              description: place.roadAddress,
              latitude: place.latitude,
              longitude: place.longitude,
            })),
          );
        })
        .catch((err) => {
          useToastStore
            .getState()
            .show(
              err instanceof Error
                ? err.message
                : "장소 검색에 실패했어요. 다시 시도해주세요.",
            );
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

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
          results={results}
          query={query}
          onSelect={(result) =>
            onSelect({
              name: result.title,
              address: result.description,
              latitude: result.latitude ?? 0,
              longitude: result.longitude ?? 0,
            })
          }
        />
      </ScrollView>
    </View>
  );
}
