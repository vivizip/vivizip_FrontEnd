import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import ReportMethodCard from "../../../features/ai-reviewer/components/move-in-report/ReportMethodCard";
import ReportInfoRow from "../../../features/ai-reviewer/components/move-in-report/ReportInfoRow";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");

/**
 * 확정일자와 체류지 신고 안내 화면 (Figma node 1588:20878)
 * - 방문/온라인 두 가지 신고 방법을 안내하는 정적 정보 화면
 */
export default function MoveInReportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="확정일자와 체류지 신고"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-4 rounded-2xl bg-[#FAFAFD] px-4 py-3">
          <View className="w-full gap-1">
            <Text className="text-title-m text-gray-800">
              체류지를 신고해볼까요?
            </Text>
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
              방문과 온라인 중 편한 방법으로 체류지를 신고해요
            </Text>
          </View>
          <Text className="w-full font-pretendard-semibold text-12 font-semibold leading-[18px] text-gray-400">
            출입국관리법상 거주지를 신고하고 보증금을 법적으로 보호받기
            위해서는 체류지 신고와 허가일자가 필요해요
          </Text>
        </View>

        <View className="w-full gap-6 pt-6">
          <ReportMethodCard
            title="방문 신고"
            subtitle="직접 방문해서 신고하고 확정일자를 받아요"
          >
            <ReportInfoRow badgeLabel="방문처">
              새로운 체류지 관할 읍·면·동 주민센터, 시·군·구청, 또는
              출입국·외국인청 전국 출입국기관 안내
            </ReportInfoRow>
            <ReportInfoRow badgeLabel="준비물">
              외국인등록증(또는 거소증), 임대차계약서 원본(확정일자 필요 시
              필수 지참)
            </ReportInfoRow>
            <ReportInfoRow badgeLabel="확정일자">
              주민센터에 임대차계약서를 제시하면 체류지 변경 신고와 동시에
              임대차계약서에 확정일자를 받을 수 있습니다
            </ReportInfoRow>
            <ReportInfoRow badgeLabel="주의사항" variant="danger">
              타인 명의 계약인 경우 숙소제공자의 신분증 및 체류지 제공
              확인서가 추가로 필요
            </ReportInfoRow>
          </ReportMethodCard>

          <ReportMethodCard
            title="온라인 신고"
            subtitle={
              <>
                간편하지만{" "}
                <Text className="text-secondary-400">
                  확정일자는 온라인으로 불가능
                </Text>
                해요
              </>
            }
          >
            <ReportInfoRow badgeLabel="방문처">
              하이코리아(Hi Korea) 공식 홈페이지의 '전자민원' 메뉴 활용
            </ReportInfoRow>
            <ReportInfoRow badgeLabel="주의사항" variant="danger">
              온라인으로 체류지 변경 신고를 하더라도{" "}
              <Text className="text-secondary-400">
                확정일자가 반드시 필요하다면 주민센터를 방문 필요
              </Text>
            </ReportInfoRow>
          </ReportMethodCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
