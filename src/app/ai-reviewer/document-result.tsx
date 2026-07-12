import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../components/TopBar";
import Tab1 from "../../components/Tab1";
import InfoRow from "../../features/ai-reviewer/components/document-result/InfoRow";
import InfoBanner from "../../features/ai-reviewer/components/document-result/InfoBanner";
import RiskCard from "../../features/ai-reviewer/components/document-result/RiskCard";
import ChecklistCard from "../../features/ai-reviewer/components/document-result/ChecklistCard";
import LoanRiskSection from "../../features/ai-reviewer/components/document-result/LoanRiskSection";

const backIcon = require("../../../assets/icons/ic_left.png");
const profileIcon = require("../../../assets/icons/icon_profile.png");
const calendarIcon = require("../../../assets/icons/lucide_calendar.png");
const buildingIcon = require("../../../assets/icons/ic_building.png");
const infoCardIcon = require("../../../assets/icons/ic_info_card.png");
const cautionIcon = require("../../../assets/icons/ic_caution_colored.png");
const checkIcon = require("../../../assets/icons/ic_check_small.png");
const cautionBigIcon = require("../../../assets/icons/ic_caution_big.png");
const aiIcon = require("../../../assets/icons/ic_ai.png");

const TABS = ["기본 정보", "위험 요소", "근저당"];

// 발급일 Date -> "YYYY.MM.DD에 발급했어요" 형식 라벨 변환
const formatIssuedAt = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}에 발급했어요`;
};

// TODO(API 대기): 분석 API 연동 전까지 Figma 목업과 동일한 정적 데이터 사용
const MOCK_RESULT = {
  documentName: "스퀘어브릿지 빌라 (서류 이름)",
  issuedAt: new Date(2026, 6, 8),
  owner: "홍길동",
  registeredAt: "2021.02.16",
  addressLines: [
    "서울 중구 충무로2가 65-4, 신한 스퀘어브릿지 빌라 501호",
    "7층 도시형생활주택",
  ],
  noticeText:
    "상업용이 아닌 주거용 건물이에요. \n비자 변경/연장 시 체류지 신고가 가능해요",
  risks: [
    {
      title: "가등기",
      description:
        "집이 법적으로 다른 사람에게 넘어갈 예정이라, 집 주인이 바뀔 수 있다는 의미예요. 소유권이 어떻게 될 것인지에 대해 정확하게 확인하고, 직거래는 안 하는 게 좋아요.",
    },
    {
      title: "임차권 등기명령",
      description:
        "앞서 집을 빌린 세입자가 집주인에게 보증금을 돌려받지 못한 사례가 있어요. 어떤 일이 있었는지 중개업자나 집주인에게 이유를 물어보는 것이 좋아요.",
    },
  ],
  preContractChecklist: [
    "왜 가등기가 등록되었는지 중개인에게 물어보세요.",
    "현재 집주인이 누구인지 다시 확인하세요.",
    "이전 세입자의 문제가 모두 해결되었는지 확인하세요.",
  ],
  loanRisk: {
    homePrice: 10000,
    maxClaimAmount: 6500,
    myDeposit: 1000,
  },
};

/**
 * 등기부등본/건축물대장 공통 분석 결과 화면 (Figma node 727:8959).
 * analyzing.tsx와 마찬가지로 문서 종류와 무관하게 공유되는 화면.
 */
export default function DocumentResultScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="등기부등본 확인"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      {/* TopBar ↔ 콘텐츠 24px, 이 블록(문서명/탭)은 스크롤과 무관하게 고정 */}
      <View className="mt-6 gap-8 px-4">
        <View className="gap-1">
          <Text className="text-title-m text-gray-900">
            {MOCK_RESULT.documentName}
          </Text>
          <Text className="text-label-m text-gray-500">
            {formatIssuedAt(MOCK_RESULT.issuedAt)}
          </Text>
        </View>

        <Tab1
          tabs={TABS}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          bgClassName="bg-gray-50"
          activeTextClassName="text-gray-900"
          inactiveTextClassName="text-gray-600"
        />
      </View>

      {/* 탭 아래 내용만 스크롤 */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 40,
          gap: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeIndex === 0 && (
          <>
            <View className="gap-6">
              <InfoRow
                icon={profileIcon}
                label="소유권"
                lines={[MOCK_RESULT.owner]}
              />
              <InfoRow
                icon={calendarIcon}
                label="등기날짜"
                lines={[MOCK_RESULT.registeredAt]}
              />
              <InfoRow
                icon={buildingIcon}
                label="주소"
                lines={MOCK_RESULT.addressLines}
                size="full"
              />
            </View>

            <InfoBanner icon={infoCardIcon} text={MOCK_RESULT.noticeText} />
          </>
        )}

        {activeIndex === 1 && (
          <View className="gap-8">
            {MOCK_RESULT.risks.map((risk, index) => (
              <RiskCard
                key={index}
                icon={cautionIcon}
                title={risk.title}
                description={risk.description}
              />
            ))}
            <ChecklistCard
              icon={checkIcon}
              title="계약 전 확인해보세요"
              items={MOCK_RESULT.preContractChecklist}
            />
          </View>
        )}

        {activeIndex === 2 && (
          <View className="gap-8">
            <LoanRiskSection
              cautionIcon={cautionBigIcon}
              aiIcon={aiIcon}
              homePrice={MOCK_RESULT.loanRisk.homePrice}
              maxClaimAmount={MOCK_RESULT.loanRisk.maxClaimAmount}
              initialMyDeposit={MOCK_RESULT.loanRisk.myDeposit}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
