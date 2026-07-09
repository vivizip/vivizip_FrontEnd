import React from "react";
import { Image, View, type ImageSourcePropType } from "react-native";

type Props = {
  /** TODO: 지도 API 연동 시 실제 지도 스냅샷 이미지 전달 */
  imageSource?: ImageSourcePropType;
};

/**
 * 선택한 주소의 지도 미리보기 (Figma)
 * - height 120px, width full, radius 16px
 * - background: lightgray 플레이스홀더 (지도 이미지 연동 전)
 */
export default function MapPreview({ imageSource }: Props) {
  return (
    <View className="h-[120px] w-full overflow-hidden rounded-2xl bg-gray-200">
      {imageSource && (
        <Image
          source={imageSource}
          className="h-full w-full"
          resizeMode="cover"
        />
      )}
    </View>
  );
}
