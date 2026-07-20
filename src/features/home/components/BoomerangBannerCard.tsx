import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import ChipM from "../../../components/ChipM";
import BottomSheet from "../../../components/BottomSheet";
import CTAButton from "../../../components/CTAButton";
import BannerImage from "../../../../assets/images/img_banner_image.svg";
import IngGradation1 from "../../../../assets/images/img_banner_ing_gradation1.svg";
import IngGradation2 from "../../../../assets/images/img_banner_ing_gradation2.svg";
import { useMatchingApplicationStore } from "../../matching/store/useMatchingApplicationStore";
import {
  getMatchResult,
  getMatchStatus,
} from "../../matching/services/matchApi";
import { useAuthUserStore } from "../../auth/store/useAuthUserStore";

const rightIcon = require("../../../../assets/icons/ic_right.png");
const gradation1 = require("../../../../assets/images/img_boomerang_banner_gradation1.png");
const gradation2 = require("../../../../assets/images/img_boomerang_banner_gradation2.png");
const matchedIllustration = require("../../../../assets/images/img_banner_image2.png");
const bellImage = require("../../../../assets/images/image_bell.png");

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx와 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

// GET /api/matches/result의 counterpart* 필드는 서버 enum 코드라서 화면 표시용
// 한글 라벨로 바꾼다. 매핑에 없는 값이 오면 원본 코드를 그대로 보여준다.
const NATIONALITY_LABELS: Record<string, string> = {
  KOREA: "한국",
  VIETNAM: "베트남",
  CHINA: "중국",
};

const GENDER_LABELS: Record<string, string> = {
  MALE: "남자",
  FEMALE: "여자",
  NOT_SPECIFIED: "밝히지 않음",
};

const KOREAN_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "초급",
  INTERMEDIATE: "중급",
  ADVANCED: "고급",
};

const DAY_CODE_LABELS: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

const PERIOD_CODE_LABELS: Record<string, string> = {
  MORNING: "오전",
  AFTERNOON: "오후",
  EVENING: "저녁",
};

/**
 * 홈 배너 카드. GET /api/matches/status의 3단계 진행 상태를 그대로 반영한다:
 * 신청 전(Figma node 1915:32820), 신청 후·매칭 전(Figma node 2719:35080,
 * "boomerang_banner(ing)"), 매칭 완료(Figma node 1868:19809).
 * useMatchingApplicationStore.matchStatus는 앱을 새로 켤 때마다 기본값
 * "NOT_APPLIED"로 초기화되므로, 이 화면이 포커스될 때마다 실제 서버 값으로
 * 새로고침한다(지속적인 polling 대신 - 매칭은 며칠~2주 단위로 진행되고, 실시간
 * 알림은 푸시로 따로 오니 화면에 돌아올 때 한 번씩 확인하는 정도면 충분).
 */
export default function BoomerangBannerCard() {
  const router = useRouter();
  const matchStatus = useMatchingApplicationStore((state) => state.matchStatus);
  const setMatchStatus = useMatchingApplicationStore(
    (state) => state.setMatchStatus,
  );
  const lastMatch = useMatchingApplicationStore((state) => state.lastMatch);
  const setLastMatch = useMatchingApplicationStore(
    (state) => state.setLastMatch,
  );
  const myUserId = useAuthUserStore((state) => state.user?.id);

  useFocusEffect(
    useCallback(() => {
      getMatchStatus()
        .then(async (status) => {
          setMatchStatus(status);
          if (status === "MATCHED") {
            const result = await getMatchResult();
            setLastMatch(result);
          }
        })
        .catch((err) => {
          console.log(
            "[Home] getMatchStatus/getMatchResult failed:",
            String(err),
          );
        });
    }, [setMatchStatus, setLastMatch]),
  );

  // 응답에는 studentId/supporterId가 둘 다 있고 이름/사진도 양쪽 다 오므로,
  // 로그인한 내 id와 비교해서 "상대방" 쪽 이름/사진만 골라낸다.
  const isMeStudent = lastMatch ? myUserId === lastMatch.studentId : false;
  const counterpartName = lastMatch
    ? isMeStudent
      ? lastMatch.supporterName
      : lastMatch.studentName
    : "";
  const counterpartProfileImage = lastMatch
    ? isMeStudent
      ? lastMatch.supporterProfileImage
      : lastMatch.studentProfileImage
    : null;
  const mateInfoRows: { label: string; value: string }[] = lastMatch
    ? [
        {
          label: "국적",
          value:
            NATIONALITY_LABELS[lastMatch.counterpartNationality] ??
            lastMatch.counterpartNationality,
        },
        {
          label: "성별",
          value:
            GENDER_LABELS[lastMatch.counterpartGender] ??
            lastMatch.counterpartGender,
        },
        ...(lastMatch.counterpartKoreanLevel
          ? [
              {
                label: "한국어 수준",
                value:
                  KOREAN_LEVEL_LABELS[lastMatch.counterpartKoreanLevel] ??
                  lastMatch.counterpartKoreanLevel,
              },
            ]
          : []),
        {
          label: "편한 시간",
          value:
            lastMatch.counterpartTimeSlots
              .map(
                (slot) =>
                  `${DAY_CODE_LABELS[slot.day] ?? slot.day} ${PERIOD_CODE_LABELS[slot.period] ?? slot.period}`,
              )
              .join(", ") || "-",
        },
      ]
    : [];

  // Modal은 visible=false가 되는 즉시 사라지므로, 닫힘 애니메이션이 끝날 때까지는 마운트를 유지
  const [isSheetMounted, setIsSheetMounted] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (isSheetOpen) {
      setIsSheetMounted(true);
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
  }, [isSheetOpen, overlayOpacity, sheetTranslateY]);

  const closeSheet = () => {
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
      setIsSheetMounted(false);
      setIsSheetOpen(false);
    });
  };

  const handlePressChat = () => {
    closeSheet();
    router.push("/matching/chat");
  };

  if (matchStatus === "APPLIED_NOT_MATCHED") {
    return (
      <View className="w-full overflow-hidden rounded-xl border border-gray-300 bg-[#F2F7FC] px-4 py-[42px]">
        <IngGradation2
          width={398}
          height={248}
          style={{ position: "absolute", left: 125, top: -1 }}
        />
        <IngGradation1
          width={231}
          height={240}
          style={{ position: "absolute", left: -108, top: -114 }}
        />
        <View className="w-full gap-1 py-2">
          <Text className="font-pretendard-semibold text-20 font-semibold leading-7 text-gray-700">
            메이트 매칭중 ..
          </Text>
          <Text className="w-full font-pretendard text-12 leading-4 text-gray-700">
            매칭이 완료되면 알림을 보내드려요 PUSH 알림을 켜주세요
          </Text>
        </View>
        <View
          className="absolute right-14 top-3"
          style={{ transform: [{ rotate: "10.94deg" }] }}
        >
          <Image
            source={bellImage}
            style={{ width: 49, height: 65 }}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  }

  if (matchStatus === "MATCHED") {
    return (
      <View className="w-full overflow-hidden rounded-xl bg-[#1F3B77] px-4 py-[10px]">
        <Image
          source={gradation2}
          className="absolute left-[127px] top-0 h-[136px] w-[201px] opacity-[0.25]"
          resizeMode="cover"
        />
        <Image
          source={gradation1}
          className="absolute left-0 top-0 h-[127px] w-[125px] opacity-[0.25]"
          resizeMode="cover"
        />
        <View className="w-full gap-3 py-2">
          <View className="w-full gap-1">
            <Text className="font-pretendard-semibold text-20 font-semibold leading-7 text-[#FAFAFD]">
              메이트 매칭완료
            </Text>
            <Text className="w-full font-pretendard text-12 leading-4 text-gray-200">
              메이트와 채팅하고 방문 일정을 정해 보세요
            </Text>
          </View>
          <Pressable
            onPress={() => setIsSheetOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="메이트 확인하기"
            className="active:opacity-70 mt-2"
          >
            <ChipM
              label="메이트 확인하기"
              icon={rightIcon}
              bgClassName="bg-[#EEF6FF] border border-gray-100"
            />
          </Pressable>
        </View>
        <View className="absolute right-7 top-7">
          <Image
            source={matchedIllustration}
            style={{ width: 70, height: 68 }}
            resizeMode="contain"
          />
        </View>

        <Modal
          visible={isSheetMounted}
          transparent
          animationType="none"
          onRequestClose={closeSheet}
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
              onPress={closeSheet}
            />
            <Animated.View
              style={{ transform: [{ translateY: sheetTranslateY }] }}
            >
              <BottomSheet>
                <View className="w-full gap-6">
                  <View className="w-full flex-row items-center gap-3">
                    {counterpartProfileImage ? (
                      <Image
                        source={{ uri: counterpartProfileImage }}
                        className="h-[52px] w-[52px] rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-[52px] w-[52px] rounded-full bg-[#E6E6EB]" />
                    )}
                    <View className="flex-1 gap-1">
                      <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-black">
                        {counterpartName || "-"}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full gap-2">
                    {mateInfoRows.map((row) => (
                      <View
                        key={row.label}
                        className="w-full flex-row items-center gap-4"
                      >
                        <Text className="w-20 font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-500">
                          {row.label}
                        </Text>
                        <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
                          {row.value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <CTAButton
                    label="채팅하기"
                    active
                    onPress={handlePressChat}
                  />
                </View>
              </BottomSheet>
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View className="w-full overflow-hidden rounded-xl bg-primary-200 px-4 py-[10px]">
      <Image
        source={gradation2}
        className="absolute left-[127px] top-0 h-[136px] w-[201px]"
        resizeMode="cover"
      />
      <Image
        source={gradation1}
        className="absolute left-0 top-0 h-[127px] w-[125px]"
        resizeMode="cover"
      />
      <View className="w-full gap-3 py-2">
        <View className="w-full gap-1">
          <Text className="font-pretendard-semibold text-20 font-semibold leading-7 text-gray-800">
            부동산 메이트랑 함께, 부메랑
          </Text>
          <Text className="w-[190px] font-pretendard text-12 leading-4 text-gray-500">
            부동산 방문부터 집 계약까지{"\n"}함께 할 친구를 구해보세요
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/matching/intro")}
          accessibilityRole="button"
          accessibilityLabel="부메랑 신청하기"
          className="active:opacity-70 mt-2"
        >
          <ChipM
            label="부메랑 신청하기"
            icon={rightIcon}
            bgClassName="bg-[#F2F7FC] border border-gray-100"
          />
        </Pressable>
      </View>
      <View className="absolute right-1 top-7">
        <BannerImage width={100} height={100} />
      </View>
    </View>
  );
}
