import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import DetailAddressInput from "../../features/ai-reviewer/components/search/DetailAddressInput";
import MapPreview from "../../features/ai-reviewer/components/search/MapPreview";
import { useRegisteredHouseStore } from "../../features/ai-reviewer/store/useRegisteredHouseStore";
import { getNearestAddress } from "../../features/ai-reviewer/services/placesApi";
import {
  createLeaseCase,
  getLeaseCaseDetail,
  getLeaseCases,
} from "../../features/ai-reviewer/services/leaseCaseApi";
import TopBar from "../../components/TopBar";
import CTAButton from "../../components/CTAButton";
import { SCREEN_PADDING } from "../../lib/layout";
import { useToastStore } from "../../store/useToastStore";

const backIcon = require("../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../assets/icons/ic_kebab.png");

const FALLBACK_SAVE_ERROR = "주소 저장에 실패했어요. 다시 시도해주세요.";

export default function ConfirmAddressScreen() {
  const router = useRouter();
  const { address, latitude, longitude } = useLocalSearchParams<{
    address?: string;
    latitude?: string;
    longitude?: string;
  }>();
  const [detailAddress, setDetailAddress] = useState("");
  // GPS 정확도가 낮아 지도를 탭/드래그로 보정할 수 있어서, address 파라미터를 그대로
  // 보여주지 않고 로컬 state로 들고 있다가 위치를 옮기면 재조회한 값으로 갱신한다.
  const [displayAddress, setDisplayAddress] = useState(address ?? "");
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const setHouses = useRegisteredHouseStore((state) => state.setHouses);

  const handleSelectMapLocation = async (lat: number, lng: number) => {
    setIsResolvingAddress(true);
    try {
      const nextAddress = await getNearestAddress(lng, lat);
      setDisplayAddress(nextAddress);
    } catch (err) {
      useToastStore
        .getState()
        .show(
          err instanceof Error
            ? err.message
            : "주소를 다시 찾지 못했어요. 다시 시도해주세요.",
        );
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const handleSave = async () => {
    if (!displayAddress || isSaving) return;
    setIsSaving(true);
    try {
      const leaseCase = await createLeaseCase({
        name: displayAddress,
        roadAddress: displayAddress,
        detailAddress,
      });
      const summaries = await getLeaseCases();
      const details = await Promise.all(
        summaries.map((summary) => getLeaseCaseDetail(summary.leaseCaseId)),
      );
      const houses = details.map((detail) => ({
        id: `${detail.leaseCaseId}`,
        title: detail.roadAddress,
        subtitle: detail.detailAddress,
      }));
      setHouses(houses, `${leaseCase.leaseCaseId}`);
      router.replace("/ai-reviewer");
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
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
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MapPreview
          latitude={latitude ? Number(latitude) : undefined}
          longitude={longitude ? Number(longitude) : undefined}
          onSelectLocation={handleSelectMapLocation}
        />

        {/* 지도 ↔ 주소 텍스트 간격은 스펙 미확정으로 눈대중값 */}
        <View className="mt-6 gap-1">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-primary-600">
            현재 주소
          </Text>
          <Text className="font-pretendard-medium text-18 font-medium leading-[26px] text-gray-900">
            {isResolvingAddress ? "주소 확인 중..." : displayAddress}
          </Text>
        </View>

        {/* 주소 텍스트 ↔ 상세 주소 입력 간격은 스펙 미확정으로 눈대중값 */}
        <View className="mt-4">
          <DetailAddressInput
            value={detailAddress}
            onChangeText={setDetailAddress}
          />
        </View>
      </ScrollView>

      <View className="px-4 pb-4">
        <CTAButton
          label={isSaving ? "저장 중..." : "저장"}
          active={detailAddress.trim().length > 0 && !isSaving}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}
