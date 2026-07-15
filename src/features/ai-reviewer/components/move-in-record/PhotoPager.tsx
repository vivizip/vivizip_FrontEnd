import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

import PageIndicator from "../../../../components/PageIndicator";

const closeIcon = require("../../../../../assets/icons/ic_x.png");

const CARD_WIDTH = 336;
const IMAGE_HEIGHT = 230;

type Props = {
  photoUris: string[];
  /** 전달하면 현재 보고 있는 사진 우상단에 삭제 버튼이 뜬다 (수정 모드, Figma node 1095:10536) */
  onRemovePhoto?: (uri: string) => void;
};

/**
 * 입주 기록 상세 화면 사진 페이저 (Figma node 1064:9818 / 수정중 1095:10536)
 * - 가로 스와이프 페이징 + 하단 중앙 점 인디케이터 (사진이 2장 이상일 때만 표시)
 */
export default function PhotoPager({ photoUris, onRemovePhoto }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  if (photoUris.length === 0) {
    return (
      <View className="h-[230px] w-full rounded-t-2xl border border-gray-100 bg-gray-100" />
    );
  }

  const currentIndex = Math.min(activeIndex, photoUris.length - 1);

  return (
    <View className="w-full">
      <View className="h-[230px] w-full overflow-hidden rounded-t-2xl border border-gray-100">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {photoUris.map((uri) => (
            <Image
              key={uri}
              source={{ uri }}
              style={{ width: CARD_WIDTH, height: IMAGE_HEIGHT }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {onRemovePhoto && (
          <Pressable
            onPress={() => onRemovePhoto(photoUris[currentIndex])}
            className="absolute right-2 top-2 h-6 w-6 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="사진 삭제"
          >
            <Image source={closeIcon} className="h-6 w-6" resizeMode="contain" />
          </Pressable>
        )}
      </View>

      {photoUris.length > 1 && (
        <View className="w-full items-center pt-2">
          <PageIndicator count={photoUris.length} activeIndex={currentIndex} />
        </View>
      )}
    </View>
  );
}
