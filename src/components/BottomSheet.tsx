import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

export type BottomSheetItem = {
  icon: ImageSourcePropType;
  label: string;
  onPress?: () => void;
};

type Props = {
  items: BottomSheetItem[];
};

/**
 * BottomSheet 공통 컴포넌트 (Figma)
 * - 프레임: width full, padding 24px 16px 40px 16px, column, items flex-start, gap 8px
 *   (하단 패딩은 기기 제스처 바에 콘텐츠가 가리지 않도록 Figma 40px에서 +30px 보정한 70px)
 * - 스타일: radius 16px 16px 0 0, bg #FFF, shadow 0 -4px 10px rgba(0,0,0,0.14)
 * - 리스트 행: padding 8px 0, items center, gap 8px, self stretch
 * - 아이콘 24x24 + 텍스트 Body-m(Pretendard 16/500, lh 24) gray-900
 */
export default function BottomSheet({ items }: Props) {
  return (
    <View
      className="w-full flex-col items-start gap-2 rounded-t-2xl bg-white px-4 pb-[70px] pt-6"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 10, // Android는 shadow* 대신 elevation 사용 (음수 offset 방향은 반영 안 됨)
      }}
    >
      {items.map((item, index) => (
        <Pressable
          key={index}
          onPress={item.onPress}
          className="w-full flex-row items-center gap-2 self-stretch py-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={item.label}
        >
          <Image
            source={item.icon}
            className="h-6 w-6"
            resizeMode="contain"
          />
          <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
