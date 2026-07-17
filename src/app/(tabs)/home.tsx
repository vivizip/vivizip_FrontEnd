import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "../../features/home/components/HomeHeader";
import BoomerangBannerCard from "../../features/home/components/BoomerangBannerCard";
import MatchingProgressCard from "../../features/home/components/MatchingProgressCard";
import ArticleZipSection from "../../features/home/components/ArticleZipSection";

/**
 * 홈 탭 - 매칭 전 상태 (Figma node 1915:33482).
 */
export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFD]">
      <HomeHeader />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 120,
          gap: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        <BoomerangBannerCard />
        <MatchingProgressCard />
        <ArticleZipSection />
      </ScrollView>
    </SafeAreaView>
  );
}
