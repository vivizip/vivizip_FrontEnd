import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DocumentScanner from "react-native-document-scanner-plugin";

import TopBar from "../../../components/TopBar";
import HeroCard from "../../../features/ai-reviewer/components/brokerage-info/HeroCard";
import PageDots from "../../../features/ai-reviewer/components/brokerage-info/PageDots";
import NumberedFeatureCard from "../../../features/ai-reviewer/components/lease-contract-info/NumberedFeatureCard";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../assets/icons/ic_kebab.png");
const cameraIcon = require("../../../../assets/icons/icon_camera.png");
const heroImage = require("../../../../assets/images/img_during_main1.png");
const amountPeriodIcon = require("../../../../assets/images/img_during_main5.png");
const contractMatchIcon = require("../../../../assets/images/img_during_main7.png");
const landlordMatchIcon = require("../../../../assets/images/img_during_main6.png");

/**
 * 임대차 계약서(집 계약서) 진입 화면 (Figma node 742:6803)
 * - 중개대상물 확인 설명서 화면과 히어로 카드/점 인디케이터 구조가 겹쳐 그대로 재사용
 */
export default function LeaseContractInfoScreen() {
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
          params: {
            documentType: "lease-contract",
            imageUri: scannedImages[0],
          },
        });
      }
      // status === "cancel"이면 사용자가 스캐너를 닫은 것 - 현재 화면 유지
    } catch (err) {
      console.log("[LeaseContractInfo] scan failed:", String(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="임대차 계약서(집 계약서)"
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
          title="임대차 계약서"
          subtitle="마지막 절차, 가장 중요한 서류를 검토해보세요!"
          ctaIcon={cameraIcon}
          ctaLabel="촬영하기"
          onPressCta={handleScanDocument}
        />

        <View className="mt-[14px]">
          <PageDots />
        </View>

        <View className="mt-[50px] w-full items-center gap-6">
          <Text className="text-title-m text-center text-gray-900">
            AI분석을 통해{" "}
            <Text className="text-title-m text-primary-600">3가지 일치성</Text>
            을 확인해요
          </Text>

          <View className="w-full gap-6">
            <NumberedFeatureCard
              number="01"
              icon={amountPeriodIcon}
              title="합의 금액 기간의 일치성"
              description={
                "부동산 임대차 계약서에 쓰여 있는\n정보가 건축물대장이랑 동일한지"
              }
            />
            <NumberedFeatureCard
              number="02"
              icon={contractMatchIcon}
              title="계약서 간 항목의 일치성"
              description={
                "집주인과 합의했던 금액과\n계약기간이 제대로 적혀있는지"
              }
            />
            <NumberedFeatureCard
              number="03"
              icon={landlordMatchIcon}
              title="집주인 신상과 서류상 일치성"
              description={
                "집주인의 정보가 신분증,\n등기부등본에 적힌 정보와 같은지"
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
