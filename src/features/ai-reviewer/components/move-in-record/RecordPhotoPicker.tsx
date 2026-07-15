import React from "react";
import { Image, Pressable, ScrollView, View } from "react-native";

import CameraIcon from "../../../../../assets/icons/ic_camera-bold.svg";
import CloseIcon from "../../../../../assets/icons/icon_delete.svg";

type Props = {
  photoUris: string[];
  onPressCamera: () => void;
  onRemovePhoto: (uri: string) => void;
};

/**
 * 입주 기록 사진 첨부 행 (Figma node 1064:9772)
 * - 첫 칸: 카메라 버튼(사진 추가), 이후: 첨부된 사진 + 우상단 X로 제거
 * TODO(카메라/앨범 연동 대기): onPressCamera는 자리만 잡은 상태.
 */
export default function RecordPhotoPicker({
  photoUris,
  onPressCamera,
  onRemovePhoto,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingTop: 10, paddingRight: 10 }}
    >
      <View className="flex-row items-start gap-2">
        <Pressable
          onPress={onPressCamera}
          className="h-[76px] w-[76px] items-center justify-center rounded-[10px] bg-gray-100 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel="사진 추가"
        >
          <CameraIcon width={24} height={24} />
        </Pressable>

        {photoUris.map((uri) => (
          <View key={uri} className="h-[76px] w-[76px]">
            <Image
              source={{ uri }}
              className="h-full w-full rounded-[10px]"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => onRemovePhoto(uri)}
              className="absolute -right-1 -top-2 h-5 w-5 items-center justify-center bg-white rounded-[50px]"
              accessibilityRole="button"
              accessibilityLabel="사진 삭제"
            >
              <CloseIcon width={24} height={24} />
            </Pressable>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
