import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import DocumentScanner from "react-native-document-scanner-plugin";

import TopBar from "../../../components/TopBar";
import CTAButton from "../../../components/CTAButton";
import {
  requestDocumentIssuance,
  type DocumentType,
} from "../../../features/ai-reviewer/services/documentApi";
import { useRegisteredHouseStore } from "../../../features/ai-reviewer/store/useRegisteredHouseStore";

const backIcon = require("../../../../assets/icons/ic_left.png");

const DOCUMENT_COPY: Record<DocumentType, { title: string; headline: string }> = {
  registry: { title: "등기부등본", headline: "등기부등본을 발급 받으셨나요?" },
  building: { title: "건축물대장", headline: "건축물대장을 발급 받으셨나요?" },
};

/**
 * 등기부등본/건축물대장 발급 방법 선택 화면 (documentType 파라미터로 공용 사용).
 * TODO: "앱에서 발급할래요"의 실제 동작(앱 발급 API) 연동 전까지 자리만 잡음.
 */
export default function RegisterDocumentScreen() {
  const router = useRouter();
  const address = useRegisteredHouseStore((state) => state.address);
  const { documentType = "registry" } = useLocalSearchParams<{
    documentType?: DocumentType;
  }>();
  const copy = DOCUMENT_COPY[documentType];

  // 앱 내 발급 요청 - 현재 등록된 집 주소를 서버로 전달 (API 나오기 전까지는 실패해도 무시하고 진행)
  const handleIssueInApp = async () => {
    if (address) {
      try {
        await requestDocumentIssuance(documentType, address);
      } catch (err) {
        console.log("[RegisterDocument] issuance request failed:", String(err));
      }
    }
    // TODO: 앱 내 발급(API) 연동 전까지 분석 화면으로 바로 이동
    router.push({
      pathname: "/ai-reviewer/analyzing",
      params: { documentType },
    });
  };

  // 네이티브 문서 스캐너 실행: 모서리 감지/가이드/자동촬영/원근보정까지 스캐너가 처리
  const handleScanDocument = async () => {
    try {
      const { scannedImages, status } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1, // 서류 1장만 촬영
      });
      if (status === "success" && scannedImages && scannedImages.length > 0) {
        // 보정된 이미지 경로를 분석 화면으로 전달 (업로드 API 연동 전까지는 전달만)
        router.push({
          pathname: "/ai-reviewer/analyzing",
          params: { documentType, imageUri: scannedImages[0] },
        });
      }
      // status === "cancel"이면 사용자가 스캐너를 닫은 것 - 현재 화면 유지
    } catch (err) {
      console.log("[DocumentScanner] scan failed:", String(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title={copy.title}
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <View className="flex-1 px-4">
        {/* TopBar ↔ 타이틀 44px */}
        <View className="mt-11 items-center gap-2">
          <Text className="text-center text-headline-s text-gray-900 font-semibold">
            {copy.headline}
          </Text>
          <Text className="text-center text-body-m text-gray-500 font-medium">
            받으셨다면 사진을 간단히 업로드 해주세요{"\n"}
            발급이 필요하시다면 도와드릴게요
          </Text>
        </View>

        {/* 서브텍스트 ↔ CTA 버튼 68px */}
        <View className="mt-[68px] gap-3">
          <CTAButton
            label="앱에서 발급할래요"
            active
            onPress={handleIssueInApp}
          />
          <Pressable
            className="h-11 w-full items-center justify-center self-stretch rounded-xl bg-primary-50 px-4 py-3 active:opacity-70"
            onPress={handleScanDocument}
            accessibilityRole="button"
          >
            <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-primary-500">
              서류 사진을 찍을래요
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
