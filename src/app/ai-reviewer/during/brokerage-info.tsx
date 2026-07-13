import React from "react";
import { Image, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DocumentScanner from "react-native-document-scanner-plugin";

import TopBar from "../../../components/TopBar";
import HeroCard from "../../../features/ai-reviewer/components/brokerage-info/HeroCard";
import PageDots from "../../../features/ai-reviewer/components/brokerage-info/PageDots";
import SectionHeader from "../../../features/ai-reviewer/components/brokerage-info/SectionHeader";
import FeatureCard from "../../../features/ai-reviewer/components/brokerage-info/FeatureCard";
import DiagramCard from "../../../features/ai-reviewer/components/brokerage-info/DiagramCard";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");
const cameraIcon = require("../../../../assets/icons/icon_camera.png");
const heroImage = require("../../../../assets/images/img_during_main1.png");
const depositRiskImage = require("../../../../assets/images/img_during_main2.png");
const insuranceRiskImage = require("../../../../assets/images/img_during_main3.png");
const documentMatchImage = require("../../../../assets/images/img_during_main4.png");
const brokerVerifyImage = require("../../../../assets/images/img_during_main5.png");

/**
 * 중개대상물 확인 설명서 진입 화면 (Figma node 742:6932)
 * - AI 분석으로 알 수 있는 것들을 안내하고 "촬영하기"로 스캐너 실행
 */
export default function BrokerageInfoScreen() {
  const router = useRouter();

  // 네이티브 문서 스캐너 실행 후 분석 화면으로 이동
  const handleScanDocument = async () => {
    try {
      const { scannedImages, status } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });
      if (status === "success" && scannedImages && scannedImages.length > 0) {
        router.push({
          pathname: "/ai-reviewer/analyzing",
          params: { documentType: "brokerage", imageUri: scannedImages[0] },
        });
      }
      // status === "cancel"이면 사용자가 스캐너를 닫은 것 - 현재 화면 유지
    } catch (err) {
      console.log("[BrokerageInfo] scan failed:", String(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="중개대상물 확인 설명서"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard
          image={heroImage}
          title="중개대상물 확인 설명서"
          subtitle="서류를 촬영해 AI로 분석하면 알 수 있는 것들"
          ctaIcon={cameraIcon}
          ctaLabel="촬영하기"
          onPressCta={handleScanDocument}
        />

        <View className="mt-[14px]">
          <PageDots />
        </View>

        {/* 섹션 1: 불법 건축물 여부 */}
        <View className="mt-11 w-full items-center gap-6">
          <SectionHeader
            title="불법 건축물 여부를 알 수 있어요"
            badgeLabel="만약 불법 건축물이라면?"
          />
          <View className="w-full flex-row items-center justify-center gap-3">
            <FeatureCard
              image={depositRiskImage}
              text={"보증금을\n돌려받기 어려워요"}
            />
            <FeatureCard
              image={insuranceRiskImage}
              text={"보증 보험 가입이\n불가능해요"}
            />
          </View>
        </View>

        <View className="mt-10 h-px w-full bg-gray-100" />

        {/* 섹션 2: 계약자/근저당권 일치 여부 */}
        <View className="mt-10 w-full items-center gap-6">
          <SectionHeader
            title={"두 가지 서류의 계약자 및 근저당권\n일치 여부를 알 수 있어요"}
            badgeLabel="등기부등본 상 소유자 = 중개대상물 소유자"
          />
          <DiagramCard
            leftIcon={documentMatchImage}
            leftLabel="등기부등본"
            rightIcon={documentMatchImage}
            rightLabel="중개대상물"
            centerLabel="AI분석"
          />
        </View>

        <View className="mt-10 h-px w-full bg-gray-100" />

        {/* 섹션 3: 중개업자 정상등록 여부 */}
        <View className="mt-10 w-full items-center gap-6">
          <SectionHeader
            title={"중개업자가 정상등록 되어있는지\n알 수 있어요"}
            badgeLabel="국가공간정보포털 인증 여부 확인"
          />
          <Image
            source={brokerVerifyImage}
            className="h-[110px] w-[120px]"
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
