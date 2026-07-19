import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const universityBadgeIcon = require("../../../../assets/icons/icon_building.png");

// TODO(대학교 인증 백엔드 미구현): 실제 인증 화면/API가 없어 "인증하기"를 누르면
// 목업으로 즉시 인증완료 상태로 전환한다. 학교 뱃지 이미지도 실제 학교별 엠블럼이
// 아닌 공용 아이콘으로 대체.
const MOCK_UNIVERSITY_NAME = "광운대학교";

/**
 * 마이페이지 "대학교 인증하기" 섹션 (Figma node 1705:18258 인증 전 / 1413:17636 인증 후).
 * 인증 전: "학교 인증을 해주세요" + 인증하기 버튼.
 * 인증 후: 학교 뱃지 + 학교명 + "인증완료" 칩.
 */
export default function UniversityVerifySection() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <View className="w-full items-end gap-0">
      <View className="w-full items-start py-3">
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
          대학교 인증하기
        </Text>
      </View>
      {isVerified ? (
        <View className="h-[74px] w-full flex-row items-center justify-between rounded-2xl bg-[#FAFAFD] px-4 py-3">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image
                source={universityBadgeIcon}
                className="h-5 w-5"
                resizeMode="contain"
              />
            </View>
            <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-800">
              {MOCK_UNIVERSITY_NAME}
            </Text>
          </View>
          <View className="items-center justify-center rounded-full bg-primary-100 px-3 py-0.5">
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-primary-500">
              인증완료
            </Text>
          </View>
        </View>
      ) : (
        <View className="h-[74px] w-full flex-row items-center justify-between rounded-2xl bg-[#FAFAFD] px-4 py-3">
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-400">
            학교 인증을 해주세요
          </Text>
          <Pressable
            onPress={() => setIsVerified(true)}
            className="items-center justify-center rounded-full bg-primary-500 px-3 py-0.5 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="인증하기"
          >
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-[#F2F7FC]">
              인증하기
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
