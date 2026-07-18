import React from "react";
import { Image, View, type DimensionValue } from "react-native";

const mapPlaceholder = require("../../../../../assets/images/img_map_placeholder.png");
const pinIcon = require("../../../../../assets/icons/ic_location_filled.png");

type Props = {
  width: DimensionValue;
  height: DimensionValue;
  pinSize?: number;
};

/**
 * 약속 장소 지도 미리보기 프레임 (Figma "map_image", AppointmentSheet 하단 /
 * 채팅방 약속 확정 카드 양쪽에서 재사용).
 * TODO(지도 API 미구현): 실제 지도 SDK(Kakao/Naver/Google Maps 등) 연동 전까지
 * 정적 이미지 위에 고정 핀만 올려 보여주는 placeholder다 - 선택한 장소와 무관하게 항상 같은 이미지.
 */
export default function MapPreview({ width, height, pinSize = 36 }: Props) {
  return (
    <View
      style={{ width, height }}
      className="overflow-hidden rounded-lg bg-gray-100"
    >
      <Image
        source={mapPlaceholder}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
      <View className="absolute inset-0 items-center justify-center">
        <Image
          source={pinIcon}
          style={{ width: pinSize, height: pinSize }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
