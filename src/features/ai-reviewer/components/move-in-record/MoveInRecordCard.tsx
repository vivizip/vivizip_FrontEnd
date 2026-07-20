import React from "react";
import { Image, Pressable, Text, View } from "react-native";

import ChipS from "../../../../components/ChipS";
import FolderTabBg from "../../../../../assets/images/img_record_folder_tab.svg";

const FOLDER_HEIGHT = 116;
const MAX_VISIBLE_ISSUES = 3;

export type MoveInRecordCardData = {
  id: number;
  /** 등록된 집 주소 (API에는 기록별 이름 필드가 없어 leaseCaseId로 조회한 주소를 대신 씀) */
  title: string;
  thumbnailUrl: string | null;
  issueLabels: string[];
};

type Props = {
  record: MoveInRecordCardData;
  onPress?: () => void;
};

/**
 * 입주 기록 카드 (Figma node 1078:9605, "입주 기록 ON")
 * - 280x325 사진 카드
 * - 하단에 폴더 탭 모양 그라데이션 배경 위에 주소 + 하자 칩(ChipS) 표시
 * - 누르면 상세 화면(move-in-record-detail)으로 이동
 * 목록 API가 사진 장수를 안 줘서 기존 "+N장" 배지는 표시하지 않는다.
 */
export default function MoveInRecordCard({ record, onPress }: Props) {
  const visibleIssues = record.issueLabels.slice(0, MAX_VISIBLE_ISSUES);
  const extraIssueCount = record.issueLabels.length - MAX_VISIBLE_ISSUES;

  return (
    <Pressable
      onPress={onPress}
      className="h-[325px] w-[280px] overflow-hidden rounded-t-2xl rounded-b-3xl bg-gray-500"
      accessibilityRole="button"
      accessibilityLabel={record.title}
    >
      {record.thumbnailUrl && (
        <Image
          source={{ uri: record.thumbnailUrl }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
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
            {record.title}
          </Text>
          <View className="flex-row flex-wrap gap-1">
            {visibleIssues.map((issue) => (
              <ChipS
                key={issue}
                label={issue}
                bgClassName="bg-white"
                textClassName="text-primary-500"
              />
            ))}
            {extraIssueCount > 0 && (
              <ChipS
                label={`+${extraIssueCount}`}
                bgClassName="bg-white"
                textClassName="text-primary-500"
              />
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
