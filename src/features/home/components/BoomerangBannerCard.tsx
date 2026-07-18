import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Modal, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import ChipM from "../../../components/ChipM";
import BottomSheet from "../../../components/BottomSheet";
import CTAButton from "../../../components/CTAButton";
import BannerImage from "../../../../assets/images/img_banner_image.svg";
import { useMatchingApplicationStore } from "../../matching/store/useMatchingApplicationStore";

const rightIcon = require("../../../../assets/icons/ic_right.png");
const gradation1 = require("../../../../assets/images/img_boomerang_banner_gradation1.png");
const gradation2 = require("../../../../assets/images/img_boomerang_banner_gradation2.png");
const matchedIllustration = require("../../../../assets/images/img_banner_image2.png");

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (houses.tsx와 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

// TODO(1:1 매칭 미구현): 실제 매칭된 메이트 프로필 데이터가 없어 목업으로 표시.
const MOCK_MATE = {
  name: "킴 응우옌",
  school: "광운대학교 컴퓨터공학과",
  nationality: "베트남 🇻🇳",
  gender: "남자",
  koreanLevel: "중급",
  availableTime: "금요일 저녁, 주말 오후",
};

const MATE_INFO_ROWS: { label: string; value: string }[] = [
  { label: "국적", value: MOCK_MATE.nationality },
  { label: "성별", value: MOCK_MATE.gender },
  { label: "한국어 수준", value: MOCK_MATE.koreanLevel },
  { label: "편한 시간", value: MOCK_MATE.availableTime },
];

/**
 * 홈 배너 카드. 부메랑 신청 전(Figma node 1915:32820)과 신청 완료 후
 * (Figma node 1868:19809, "boomerang_banner(ing)") 두 상태를 가진다.
 * useMatchingApplicationStore.isApplied는 MatchingOnboardingScreen의 완료 화면
 * "완료" CTA에서 true로 바뀐다 - 서로 다른 네비게이션 스택(탭 vs 매칭 온보딩)이라
 * 스토어로 공유한다.
 */
export default function BoomerangBannerCard() {
  const router = useRouter();
  const isApplied = useMatchingApplicationStore((state) => state.isApplied);

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

  if (isApplied) {
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
                    <View className="h-[52px] w-[52px] rounded-full bg-[#E6E6EB]" />
                    <View className="flex-1 gap-1">
                      <Text className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-black">
                        {MOCK_MATE.name}
                      </Text>
                      <Text className="font-pretendard text-12 leading-4 text-black">
                        {MOCK_MATE.school}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full gap-2">
                    {MATE_INFO_ROWS.map((row) => (
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
