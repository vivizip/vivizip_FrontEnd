import React from "react";
import { Image, Text, View } from "react-native";

import CTAButton from "../../../../components/CTAButton";

const house1 = require("../../../../../assets/images/house1.png");
const house2 = require("../../../../../assets/images/house2.png");

type Props = {
  /** 작성된 입주 기록이 하나라도 있으면 true (Figma "입주 기록 ON") */
  hasRecords: boolean;
  onAddNewHouse: () => void;
};

/**
 * 입주 기록 화면 상단 배너
 * - 기록 없음(Figma node 1082:10171): 집 일러스트 + 축하 문구
 * - 기록 있음(Figma node 1078:9605): 안내 문구 + "새로운 집 추가하기" CTA
 */
export default function HeroBanner({ hasRecords, onAddNewHouse }: Props) {
  if (hasRecords) {
    return (
      <View className="w-full items-center justify-center gap-3 rounded-2xl bg-[#F2F7FC] px-4 py-3">
        <Text className="text-center font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-700">
          하자 사진을 촬영하고 관리해보세요
        </Text>
        <CTAButton
          label="새로운 집 추가하기"
          active
          onPress={onAddNewHouse}
          fontsizeClassName="text-[14px]"
        />
      </View>
    );
  }

  return (
    <View className="h-[110px] w-full justify-center gap-3 overflow-hidden rounded-2xl bg-[#F2F7FC] px-4 py-3">
      <Text className="z-10 font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-700">
        새로운 집을 구하신 것을 축하드려요!
      </Text>
      <Image
        source={house1}
        className="absolute -bottom-3 right-12"
        resizeMode="contain"
      />
      <Image
        source={house2}
        className="absolute -bottom-3 right-4"
        resizeMode="contain"
      />
    </View>
  );
}
