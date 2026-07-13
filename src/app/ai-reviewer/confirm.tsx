import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import DetailAddressInput from "../../features/ai-reviewer/components/search/DetailAddressInput";
import MapPreview from "../../features/ai-reviewer/components/search/MapPreview";
import { useRegisteredHouseStore } from "../../features/ai-reviewer/store/useRegisteredHouseStore";
import TopBar from "../../components/TopBar";
import CTAButton from "../../components/CTAButton";

const backIcon = require("../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../assets/icons/ic_kebab.png");

export default function ConfirmAddressScreen() {
  const router = useRouter();
  const { address } = useLocalSearchParams<{ address?: string }>();
  const [detailAddress, setDetailAddress] = useState("");
  const setRegisteredAddress = useRegisteredHouseStore(
    (state) => state.setAddress,
  );

  const handleSave = () => {
    // TODO: 실제 저장(백엔드 연동) 전까지 로컬 상태(HouseSelector)만 갱신
    if (address) {
      setRegisteredAddress(address);
    }
    router.replace("/ai-reviewer");
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <MapPreview />

        {/* 지도 ↔ 주소 텍스트 간격은 스펙 미확정으로 눈대중값 */}
        <View className="mt-6 gap-1">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-primary-600">
            현재 주소
          </Text>
          <Text className="font-pretendard-medium text-18 font-medium leading-[26px] text-gray-900">
            {address}
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
          label="저장"
          active={detailAddress.trim().length > 0}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}
