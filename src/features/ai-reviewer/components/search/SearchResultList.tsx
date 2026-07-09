import React from "react";
import { Pressable, View } from "react-native";

import SearchResultItem, { type AddressSearchResult } from "./SearchResultItem";

type Props = {
  results: AddressSearchResult[];
  query: string;
  onSelect?: (result: AddressSearchResult) => void;
};

/**
 * 주소 검색 결과 목록.
 * TODO: 지도 API 연동 전까지 상위(search.tsx)에서 목데이터를 넘겨받는 상태.
 * 항목 간 세로 간격(16px)은 스펙 미확정으로 눈대중값.
 */
export default function SearchResultList({ results, query, onSelect }: Props) {
  return (
    <View className="w-full gap-3">
      {results.map((result) => (
        <Pressable
          key={result.title}
          onPress={() => onSelect?.(result)}
          className="active:opacity-70"
        >
          <SearchResultItem result={result} query={query} />
        </Pressable>
      ))}
    </View>
  );
}
