import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";

import EditIcon from "../../../../assets/icons/icon_edit s.svg";
import CameraIcon from "../../../../assets/icons/ic_camera-bold.svg";
import { useMatchingApplicationStore } from "../../matching/store/useMatchingApplicationStore";
import { useMoveInRecordStore } from "../../ai-reviewer/store/useMoveInRecordStore";
import { useAuthUserStore } from "../../auth/store/useAuthUserStore";
import BottomSheet from "../../../components/BottomSheet";
import CTAButton from "../../../components/CTAButton";
import LanguageSelectSheet, {
  type LanguageOption,
} from "./LanguageSelectSheet";
import TimeSlotEditSheet from "./TimeSlotEditSheet";
import {
  DAY_KEYS,
  DAY_LABELS,
  PERIODS,
  buildTimeSlotKey,
} from "../../matching/components/onboarding/MatchingOnboardingTimeSlotStep";

const koreaFlag = require("../../../../assets/images/img_korea.png");
const vietnamFlag = require("../../../../assets/images/img_vietnam.png");
const chinaFlag = require("../../../../assets/images/img_china.png");
const homeStatIcon = require("../../../../assets/icons/ic_my_home.png");
const recordStatIcon = require("../../../../assets/icons/ic_my_record.png");
const matchingStatIcon = require("../../../../assets/icons/ic_my_matching.png");

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (다른 화면과 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

// GET /api/options/languages의 code 값을 그대로 키로 쓴다(GET /api/users/me의
// language 필드와 동일한 백엔드 enum). 매핑에 없는 코드는 KOREAN 표시로 폴백한다.
const LANGUAGE_DISPLAY: Record<
  string,
  { code: string; flag: ImageSourcePropType }
> = {
  KOREAN: { code: "KR", flag: koreaFlag },
  VIETNAMESE: { code: "VN", flag: vietnamFlag },
  CHINESE: { code: "CN", flag: chinaFlag },
};

const FALLBACK_NICKNAME = "회원";
const FALLBACK_LABEL = "-";

// GET /api/users/me의 nationality/gender/language는 예시값(KOREA/MALE/KOREAN)만 확인됐고
// 전체 enum 목록은 미확인이라, 매핑에 없는 값이 오면 원본 문자열을 그대로 보여준다.
const NATIONALITY_LABELS: Record<string, string> = {
  KOREA: "한국",
  VIETNAM: "베트남",
  CHINA: "중국",
};

const GENDER_LABELS: Record<string, string> = {
  MALE: "남자",
  FEMALE: "여자",
  NOT_SPECIFIED: "비공개",
};

/**
 * 마이페이지 "내 정보" 섹션 (Figma node 1705:18257).
 * 국적 칩 + 프로필(아바타/이름/성별) + 활동 통계(디데이/기록/매칭) + 활동 시간대 카드.
 * 아바타 카메라 배지, 활동 시간대 편집 아이콘은 아직 인터랙션 없이 표시만 한다(디자인 상 실제 사진 변경 기능은 범위 밖).
 */
export default function MyInfoSection() {
  const router = useRouter();
  const role = useMatchingApplicationStore((state) => state.role);
  const houseFoundAt = useMatchingApplicationStore(
    (state) => state.houseFoundAt,
  );
  const matchCount = useMatchingApplicationStore((state) => state.matchCount);
  const recordCount = useMoveInRecordStore((state) => state.records.length);
  const profile = useAuthUserStore((state) => state.user);
  const nickname = profile?.nickname ?? FALLBACK_NICKNAME;
  const nationalityLabel = profile?.nationality
    ? (NATIONALITY_LABELS[profile.nationality] ?? profile.nationality)
    : FALLBACK_LABEL;
  const genderLabel = profile?.gender
    ? (GENDER_LABELS[profile.gender] ?? profile.gender)
    : FALLBACK_LABEL;
  const isSupporter = role === "supporter";
  const dDay = houseFoundAt
    ? Math.floor((Date.now() - houseFoundAt.getTime()) / MS_PER_DAY)
    : 0;

  // 프로필의 language를 초기값으로만 쓰고(1회), 이후 시트에서 고른 값은 로컬 상태로만 관리한다
  // (TODO(언어 변경 API 미구현): 실제로 서버에 반영하는 엔드포인트가 아직 없음).
  const [language, setLanguage] = useState<LanguageOption>(
    () => useAuthUserStore.getState().user?.language ?? "KOREAN",
  );
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  const [isLanguageSheetMounted, setIsLanguageSheetMounted] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (isLanguageSheetOpen) {
      setIsLanguageSheetMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.25,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLanguageSheetOpen, overlayOpacity, sheetTranslateY]);

  const closeLanguageSheet = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_OFFSCREEN_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLanguageSheetMounted(false);
      setIsLanguageSheetOpen(false);
    });
  };

  const handleConfirmLanguage = (next: LanguageOption) => {
    setLanguage(next);
    closeLanguageSheet();
  };

  // TODO(활동 시간대 조회 API 미구현): 온보딩에서 고른 시간대를 불러올 API가 아직
  // 없어 빈 값으로 시작한다 - API 생기면 profile 기준으로 초기값을 채울 것.
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Set<string>>(
    () => new Set(),
  );
  const [isTimeSlotSheetOpen, setIsTimeSlotSheetOpen] = useState(false);
  const [isTimeSlotSheetMounted, setIsTimeSlotSheetMounted] = useState(false);
  const timeSlotOverlayOpacity = useRef(new Animated.Value(0)).current;
  const timeSlotSheetTranslateY = useRef(
    new Animated.Value(SHEET_OFFSCREEN_Y),
  ).current;

  useEffect(() => {
    if (isTimeSlotSheetOpen) {
      setIsTimeSlotSheetMounted(true);
      Animated.parallel([
        Animated.timing(timeSlotOverlayOpacity, {
          toValue: 0.25,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(timeSlotSheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isTimeSlotSheetOpen, timeSlotOverlayOpacity, timeSlotSheetTranslateY]);

  const closeTimeSlotSheet = () => {
    Animated.parallel([
      Animated.timing(timeSlotOverlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(timeSlotSheetTranslateY, {
        toValue: SHEET_OFFSCREEN_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsTimeSlotSheetMounted(false);
      setIsTimeSlotSheetOpen(false);
    });
  };

  const handleConfirmTimeSlots = (next: Set<string>) => {
    setSelectedTimeSlots(next);
    closeTimeSlotSheet();
  };

  const activityTimeChips = DAY_KEYS.flatMap((dayKey, dayIndex) =>
    PERIODS.filter((period) =>
      selectedTimeSlots.has(buildTimeSlotKey(dayKey, period.key)),
    ).map(
      (period) => `${DAY_LABELS[dayIndex]}, ${period.label} ${period.range}`,
    ),
  );

  return (
    <>
      <View className="w-full gap-2.5">
        <View className="w-full flex-row items-center justify-between">
          <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
            내 정보
          </Text>
          <Pressable
            onPress={() => setIsLanguageSheetOpen(true)}
            className="h-7 flex-row items-center justify-center gap-1 rounded-full bg-[#FAFAFD] py-0.5 pl-3 pr-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="언어 선택"
          >
            <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
              {(LANGUAGE_DISPLAY[language] ?? LANGUAGE_DISPLAY.KOREAN).code}
            </Text>
            <Image
              source={
                (LANGUAGE_DISPLAY[language] ?? LANGUAGE_DISPLAY.KOREAN).flag
              }
              className="h-[18px] w-6 rounded-sm"
              resizeMode="cover"
            />
          </Pressable>
        </View>

        {!profile ? (
          <View
            className="w-full gap-3 rounded-2xl bg-[#F2F7FC] px-4 py-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.07,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Text className="w-full text-center font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
              로그인이 필요합니다.
            </Text>
            <CTAButton
              label="로그인"
              active
              onPress={() => router.push("/login")}
            />
          </View>
        ) : (
          <View
            className="w-full gap-4 rounded-2xl bg-[#F2F7FC] px-4 py-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.07,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <View className="w-full flex-row items-center justify-center gap-4">
              <View className="h-[60px] w-[60px]">
                {profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    className="h-[60px] w-[60px] rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FAFAFD]" />
                )}
                {/* TODO(프로필 사진 변경 미구현): Figma 상 배지만 존재, 실제 촬영/업로드 연결 없음 */}
                <View
                  className="absolute bottom-0 right-0 h-6 w-6 items-center justify-center rounded-full bg-white"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <CameraIcon width={14} height={14} />
                </View>
              </View>
              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-800">
                    {nickname}
                  </Text>
                  {isSupporter && (
                    <View className="items-center justify-center rounded-full bg-primary-500 px-3 py-0.5">
                      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-white">
                        서포터즈
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                    {nationalityLabel}
                  </Text>
                  <View className="h-3.5 w-px bg-gray-300" />
                  <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                    {genderLabel}
                  </Text>
                </View>
              </View>
            </View>

            <View className="w-full flex-row items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3">
              <View className="w-[74px] items-center gap-2">
                <Image
                  source={homeStatIcon}
                  className="h-[26px] w-[30px]"
                  resizeMode="contain"
                />
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-primary-500">
                  D+{dDay}
                </Text>
              </View>
              <View className="h-8 w-px bg-gray-200" />
              <View className="w-[74px] items-center gap-2">
                <Image
                  source={recordStatIcon}
                  className="h-[26px] w-[30px]"
                  resizeMode="contain"
                />
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                  기록 <Text className="text-primary-500">{recordCount}건</Text>
                </Text>
              </View>
              <View className="h-8 w-px bg-gray-200" />
              <View className="w-[74px] items-center gap-2">
                <Image
                  source={matchingStatIcon}
                  className="h-[26px] w-[30px]"
                  resizeMode="contain"
                />
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                  매칭 <Text className="text-primary-500">{matchCount}회</Text>
                </Text>
              </View>
            </View>

            <View className="w-full gap-2 rounded-2xl bg-white py-3">
              <View className="flex-row items-center gap-1 px-4">
                <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
                  나의 활동 시간대
                </Text>
                <Pressable
                  onPress={() => setIsTimeSlotSheetOpen(true)}
                  className="h-6 w-6 items-center justify-center"
                  accessibilityRole="button"
                  accessibilityLabel="활동 시간대 수정"
                >
                  <EditIcon width={16} height={16} />
                </Pressable>
              </View>
              <View className="w-full flex-row flex-wrap gap-1 px-4">
                {activityTimeChips.length > 0 ? (
                  activityTimeChips.map((label, index) => (
                    <View
                      key={`${label}-${index}`}
                      className="items-center justify-center rounded-full bg-[#FAFAFD] px-3 py-0.5"
                    >
                      <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
                        {label}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="w-full text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-400 py-4">
                    활동 시간대를 선택해주세요
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </View>

      <Modal
        visible={isLanguageSheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeLanguageSheet}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: overlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={closeLanguageSheet}
          />
          <Animated.View
            style={{ transform: [{ translateY: sheetTranslateY }] }}
          >
            <BottomSheet>
              <LanguageSelectSheet
                value={language}
                onConfirm={handleConfirmLanguage}
                isOpen={isLanguageSheetOpen}
              />
            </BottomSheet>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={isTimeSlotSheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeTimeSlotSheet}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: timeSlotOverlayOpacity,
            }}
          />
          <Pressable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onPress={closeTimeSlotSheet}
          />
          <Animated.View
            style={{ transform: [{ translateY: timeSlotSheetTranslateY }] }}
          >
            <BottomSheet>
              <TimeSlotEditSheet
                initialSelected={selectedTimeSlots}
                onConfirm={handleConfirmTimeSlots}
              />
            </BottomSheet>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
