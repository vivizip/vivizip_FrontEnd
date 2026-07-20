import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuthUserStore } from "../../auth/store/useAuthUserStore";

const universityBadgeIcon = require("../../../../assets/icons/icon_building.png");

const FALLBACK_SCHOOL_LABEL = "-";

/**
 * 마이페이지 "대학교 인증하기" 섹션 (Figma node 1705:18258 인증 전 / 1413:17636 인증 후).
 * 인증 전: "학교 인증을 해주세요" + 인증하기 버튼(누르면 온보딩과 동일한 학교 메일 인증
 * 화면 /mypage/school-verify로 이동).
 * 인증 후: 학교 뱃지 + 학교명 + "인증완료" 칩.
 * TODO(학교명 조회 API 미구현): 프로필에는 schoolId(숫자)만 있고 학교 이름이 없어서
 * 우선 schoolId를 그대로 표시한다. 학교명 매핑 API가 생기면 교체할 것.
 * 인증 상태는 GET /api/users/me의 schoolVerified를 그대로 구독한다(로컬 state 없음) -
 * school-verify 화면이 인증 확인 성공 후 getMyProfile()로 다시 불러와 setUser로 갱신하면
 * 여기 자동 반영.
 */
export default function UniversityVerifySection() {
  const router = useRouter();
  const profile = useAuthUserStore((state) => state.user);
  const isVerified = profile?.schoolVerified ?? false;
  const schoolLabel =
    profile?.schoolId != null ? String(profile.schoolId) : FALLBACK_SCHOOL_LABEL;

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
              {schoolLabel}
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
            onPress={() => router.push("/mypage/school-verify")}
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
