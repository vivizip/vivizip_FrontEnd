import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import CurrentLocationButton from "../../features/ai-reviewer/components/search/CurrentLocationButton";
import RecentSearchChips from "../../features/ai-reviewer/components/search/RecentSearchChips";
import SearchExampleList from "../../features/ai-reviewer/components/search/SearchExampleList";
import TopBar from "../../components/TopBar";
import SearchInput from "../../components/SearchInput";

const backIcon = require("../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../assets/icons/ic_kebab.png");

export default function AddressSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // TODO: 실제 검색 기록 연동 전까지 임시 목데이터
  const [recentKeywords, setRecentKeywords] = useState<string[]>([
    "경기도 부천시",
    "삼립빌라",
  ]);

  const handleRemoveKeyword = (keyword: string) => {
    setRecentKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="주소 검색"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
          gap: 16, // 구분선 ↔ SearchExampleList 간격
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="도로명 주소를 검색하세요"
          />
          <View className="mt-2">
            <CurrentLocationButton />
          </View>

          {recentKeywords.length > 0 && (
            // CurrentLocationButton과 20px 간격
            <View className="mt-5">
              <RecentSearchChips
                keywords={recentKeywords}
                onRemove={handleRemoveKeyword}
              />
            </View>
          )}

          {/* 위 내용(최근검색어 유무 무관)과 32px 간격, 항상 표시되는 구분선 */}
          <View className="mt-8 h-px w-full bg-gray-50" />
        </View>

        <SearchExampleList />
      </ScrollView>
    </SafeAreaView>
  );
}
