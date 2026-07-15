import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import ChipS from "../../../../components/ChipS";
import FolderTabBg from "../../../../../assets/images/img_record_folder_tab.svg";
import type { MoveInRecord } from "../../store/useMoveInRecordStore";

const FOLDER_HEIGHT = 116;

type Props = {
  record: MoveInRecord;
  onPress?: () => void;
};

/**
 * 입주 기록 카드 (Figma node 1078:9605, "입주 기록 ON")
 * - 280x325 사진 카드, 사진이 여러 장이면 우상단에 "+N장" 배지
 * - 하단에 폴더 탭 모양 그라데이션 배경 위에 주소 + 하자 칩(ChipS) 표시
 * - 누르면 상세 화면(move-in-record-detail)으로 이동
 */
export default function MoveInRecordCard({ record, onPress }: Props) {
  const extraCount = record.photoUris.length - 1;

  return (
    <Pressable
      onPress={onPress}
      className="h-[325px] w-[280px] overflow-hidden rounded-t-2xl rounded-b-3xl bg-gray-500"
      accessibilityRole="button"
      accessibilityLabel={record.address}
    >
      {record.photoUris[0] && (
        <Image
          source={{ uri: record.photoUris[0] }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      )}

      {extraCount > 0 && (
        <View
          className="absolute right-2 top-2 rounded-2xl px-2.5 py-1"
          style={{
            backgroundColor: "rgba(242,247,252,0.8)",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
            +{extraCount}장
          </Text>
        </View>
      )}

      <View
        className="absolute bottom-0 left-0 w-full"
        style={{ height: FOLDER_HEIGHT }}
      >
        <View
          className="absolute bottom-0 left-0 w-full rounded-2xl"
          style={{ height: 100, backgroundColor: "#A0CFFF" }}
        />
        <FolderTabBg
          width="100%"
          height={FOLDER_HEIGHT}
          preserveAspectRatio="none"
        />
        <View className="absolute bottom-5 left-3 right-3 gap-3">
          <Text
            numberOfLines={1}
            className="font-pretendard-semibold text-16 font-semibold tracking-[-0.16px] text-gray-800"
          >
            {record.address}
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {record.issues.map((issue) => (
              <ChipS
                key={issue}
                label={issue}
                bgClassName="bg-white"
                textClassName="text-primary-500"
              />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
