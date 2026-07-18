import React from "react";
import { Pressable, Text, View } from "react-native";

import CameraIcon from "../../../../../assets/icons/ic_camera.svg";
import GalleryIcon from "../../../../../assets/icons/ic_gallery.svg";

type Props = {
  onPressCamera: () => void;
  onPressGallery: () => void;
};

/**
 * 채팅방 "+"(첨부) 버튼을 누르면 뜨는 작은 팝업 메뉴 (Figma node 1581:48008 하단,
 * "filter choose/Default" - "사진 찍기"/"앨범에서 업로드").
 * 화면 전체 폭의 공용 BottomSheet와 달리 입력창 위에 붙는 작은 카드(width 248px)라
 * 별도로 만들었다.
 */
export default function AttachmentMenu({
  onPressCamera,
  onPressGallery,
}: Props) {
  return (
    <View className="w-[248px] gap-0.5 overflow-hidden rounded-xl bg-gray-100">
      <Pressable
        onPress={onPressCamera}
        className="w-full flex-row items-center gap-2 bg-[#FAFAFD] p-3 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="사진 찍기"
      >
        <CameraIcon width={24} height={24} />
        <Text className="flex-1 font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
          사진 찍기
        </Text>
      </Pressable>
      <Pressable
        onPress={onPressGallery}
        className="w-full flex-row items-center gap-2 bg-[#FAFAFD] p-3 active:opacity-70"
        accessibilityRole="button"
        accessibilityLabel="앨범에서 업로드"
      >
        <GalleryIcon width={24} height={24} />
        <Text className="flex-1 font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
          앨범에서 업로드
        </Text>
      </Pressable>
    </View>
  );
}
