import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  ctaIcon: ImageSourcePropType;
  ctaLabel: string;
  onPressCta: () => void;
};

/**
 * 중개대상물 확인 설명서 화면의 히어로 카드 (Figma)
 * - 프레임: padding 153px 16px 81px(-> pb-6로 보정) 16px, gap 10px, radius 16px
 * - 배경: linear-gradient(180deg, #FFF -> #DFEFFF), shadow 0 4px 16px rgba(0,0,0,0.08)
 */
export default function HeroCard({
  image,
  title,
  subtitle,
  ctaIcon,
  ctaLabel,
  onPressCta,
}: Props) {
  return (
    <View
      className="w-full rounded-2xl"
      style={{
        // elevation은 opacity와 무관하게 Android 자체 밝기 테이블을 따라서 실기기에서
        // shadowOpacity 0.08보다 훨씬 진하게 보임 - Android에서만 elevation을 낮춰 보정
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 1,
      }}
    >
      <LinearGradient
        colors={["#FFFFFF", "#DFEFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="w-full items-start gap-2.5 overflow-hidden rounded-2xl px-4 pb-6 pt-[153px]"
        style={{ minHeight: 290 }}
      >
        <Image
          source={image}
          className="absolute right-[1px] top-[36px] h-[167px] w-[175px]"
          resizeMode="contain"
          style={{ opacity: 0.7 }}
        />
        <View className="w-full gap-2.5">
          <Text className="text-headline-s text-gray-900 font-semibold">
            {title}
          </Text>
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-500">
            {subtitle}
          </Text>
        </View>
        <Pressable
          onPress={onPressCta}
          className="h-11 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary-500 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={ctaLabel}
        >
          <Image
            source={ctaIcon}
            className="h-6 w-6"
            resizeMode="contain"
            style={{ tintColor: "#FFFFFF" }}
          />
          <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-white">
            {ctaLabel}
          </Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
