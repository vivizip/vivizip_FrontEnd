import React from "react";
import { Image, Text, View, type ImageSourcePropType } from "react-native";

export type CheckedItem = {
  title: string;
  description: string;
};

type Props = {
  icon: ImageSourcePropType;
  title: string;
  items: CheckedItem[];
};

/**
 * 위험요소 positive 상태의 "OO에서 확인한 내용이에요" 카드 (Figma 스펙 반영)
 * - 프레임: padding 16px 12px, gap 16px, radius 16px, bg primary-10(#F2F7FC)
 * - 제목: Title-s(16/600/lh24/ls -0.16px) gray-800, 4px 아래 구분선(gray-200, 1px)
 * - 항목 체크 아이콘: 카드 톤(primary-500)에 맞춰 tintColor 적용
 */
export default function CheckedItemsCard({ icon, title, items }: Props) {
  return (
    <View className="w-full flex-col items-start gap-4 rounded-2xl bg-[#F2F7FC] px-3 py-4 pb-10">
      <View className="w-full flex-col items-start gap-1">
        <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-800">
          {title}
        </Text>
        <View className="h-px w-full bg-gray-200" />
      </View>
      <View className="w-full flex-col items-start gap-3 pl-2">
        {items.map((item, index) => (
          <View key={index} className="w-full flex-row items-start gap-2">
            <Image
              source={icon}
              className="mt-0.5 h-4 w-4"
              resizeMode="contain"
              style={{ tintColor: "#2C74F2" }}
            />
            <View className="flex-1 flex-col items-start gap-0.5">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900">
                {item.title}
              </Text>
              <Text className="font-pretendard-medium text-12 font-medium leading-[18px] text-gray-500">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
