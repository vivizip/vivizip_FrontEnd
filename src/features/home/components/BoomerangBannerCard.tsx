import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import ChipM from "../../../components/ChipM";
import BannerImage from "../../../../assets/images/banner_image.svg";

const rightIcon = require("../../../../assets/icons/ic_right.png");
const gradation1 = require("../../../../assets/images/img_boomerang_banner_gradation1.png");
const gradation2 = require("../../../../assets/images/img_boomerang_banner_gradation2.png");

/**
 * "부동산 메이트랑 함께, 부메랑" 배너 카드 (Figma node 1915:32820).
 * "부메랑 신청하기"를 누르면 부메랑 소개 화면(/matching/intro)으로 이동.
 */
export default function BoomerangBannerCard() {
  const router = useRouter();

  return (
    <View className="w-full overflow-hidden rounded-xl bg-primary-200 px-4 py-[10px]">
      <Image
        source={gradation2}
        className="absolute left-[126px] top-0 h-[248px] w-[398px]"
        resizeMode="cover"
      />
      <Image
        source={gradation1}
        className="absolute left-[-107px] top-[-113px] h-[240px] w-[231px]"
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
