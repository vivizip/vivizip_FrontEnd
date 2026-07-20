import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";

import CurrentLocationButton from "../../features/ai-reviewer/components/search/CurrentLocationButton";
import RecentSearchChips from "../../features/ai-reviewer/components/search/RecentSearchChips";
import SearchExampleList from "../../features/ai-reviewer/components/search/SearchExampleList";
import SearchResultList from "../../features/ai-reviewer/components/search/SearchResultList";
import type { AddressSearchResult } from "../../features/ai-reviewer/components/search/SearchResultItem";
import TopBar from "../../components/TopBar";
import SearchInput from "../../components/SearchInput";
import { SCREEN_PADDING } from "../../lib/layout";
import {
  getNearestAddress,
  searchPlaces,
} from "../../features/ai-reviewer/services/placesApi";
import {
  addRecentKeyword,
  getRecentKeywords,
  removeRecentKeyword,
} from "../../features/ai-reviewer/lib/recentSearchStorage";
import { useToastStore } from "../../store/useToastStore";

const backIcon = require("../../../assets/icons/ic_left.png");

// 검색어 입력마다 API를 호출하지 않도록 타이핑이 멈춘 뒤에만 호출
const SEARCH_DEBOUNCE_MS = 300;

export default function AddressSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);

  useEffect(() => {
    getRecentKeywords().then(setRecentKeywords);
  }, []);

  const handleRemoveKeyword = (keyword: string) => {
    setRecentKeywords((prev) => prev.filter((k) => k !== keyword));
    removeRecentKeyword(keyword);
  };

  const [isLocating, setIsLocating] = useState(false);

  const handlePressCurrentLocation = async () => {
    if (isLocating) return;
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        useToastStore.getState().show("위치 접근 권한이 필요해요.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const address = await getNearestAddress(
        position.coords.longitude,
        position.coords.latitude,
      );
      router.push({
        pathname: "/ai-reviewer/confirm",
        params: {
          address,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        },
      });
    } catch (err) {
      useToastStore
        .getState()
        .show(
          err instanceof Error
            ? err.message
            : "현재 위치를 찾지 못했어요. 다시 시도해주세요.",
        );
    } finally {
      setIsLocating(false);
    }
  };

  const isSearching = query.trim().length > 0;
  const [results, setResults] = useState<AddressSearchResult[]>([]);

  // 검색 결과 목록을 보고 있을 때 뒤로가기를 누르면 이전 라우트(서류 검토 탭)로
  // 바로 나가지 않고, 최근검색어가 보이는 이 화면의 검색 전 상태로만 돌아간다.
  const handlePressBack = () => {
    if (isSearching) {
      setQuery("");
      return;
    }
    router.back();
  };

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
              title: place.roadAddress,
              description: place.placeName,
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
                : "검색에 실패했어요. 다시 시도해주세요.",
            );
        });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="주소 검색"
        leftIcon={backIcon}
        onPressLeft={handlePressBack}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="도로명 주소를 검색하세요"
        />

        {isSearching ? (
          // 검색 결과와의 간격은 스펙 미확정으로 눈대중값
          <View className="mt-4">
            <SearchResultList
              results={results}
              query={query}
              onSelect={(result) => {
                addRecentKeyword(query.trim()).then(setRecentKeywords);
                router.push({
                  pathname: "/ai-reviewer/confirm",
                  params: {
                    address: result.title,
                    latitude: result.latitude != null ? String(result.latitude) : undefined,
                    longitude: result.longitude != null ? String(result.longitude) : undefined,
                  },
                });
              }}
            />
          </View>
        ) : (
          <>
            <View className="mt-2">
              <CurrentLocationButton onPress={handlePressCurrentLocation} />
            </View>

            {recentKeywords.length > 0 && (
              // CurrentLocationButton과 20px 간격
              <View className="mt-5">
                <RecentSearchChips
                  keywords={recentKeywords}
                  onRemove={handleRemoveKeyword}
                  onSelect={setQuery}
                />
              </View>
            )}

            {/* 위 내용(최근검색어 유무 무관)과 32px 간격, 항상 표시되는 구분선 */}
            <View className="mt-8 h-px w-full bg-gray-50" />

            {/* 구분선과 16px 간격 */}
            <View className="mt-4">
              <SearchExampleList />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
