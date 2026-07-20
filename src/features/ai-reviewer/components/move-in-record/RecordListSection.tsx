import React from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

import CTAButton from "../../../../components/CTAButton";
import RecordSortMenu, { type SortOrder } from "./RecordSortMenu";
import MoveInRecordCard, { type MoveInRecordCardData } from "./MoveInRecordCard";

const emptyRecordImage = require("../../../../../assets/images/img_empty_record.png");

type Props = {
  records: MoveInRecordCardData[];
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  onAddNewHouse: () => void;
  onPressRecord: (id: number) => void;
};

/**
 * "입주 기록 리스트" 섹션
 * - 기록 없음(Figma node 1082:10171 / 빈 상태 카드 1095:9641): 폴더 일러스트 + 새로운 집 추가 버튼
 * - 기록 있음(Figma node 1078:9605): 기록 카드 가로 스크롤 리스트, 카드를 누르면 상세 화면으로 이동
 * 정렬은 서버의 sort=latest/oldest 파라미터를 그대로 쓰므로(GET /api/move-in-records),
 * 정렬 변경 시 부모가 다시 조회해야 해서 sortOrder 상태를 부모로 올렸다.
 */
export default function RecordListSection({
  records,
  sortOrder,
  onSortOrderChange,
  onAddNewHouse,
  onPressRecord,
}: Props) {
  const hasRecords = records.length > 0;

  return (
    <View className="w-full gap-4">
      <View className="w-full flex-row items-center justify-between">
        <Text className="text-title-m text-gray-800">입주 기록 리스트</Text>
        <RecordSortMenu value={sortOrder} onChange={onSortOrderChange} />
      </View>

      {hasRecords ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {records.map((record) => (
              <MoveInRecordCard
                key={record.id}
                record={record}
                onPress={() => onPressRecord(record.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ImageBackground
          source={emptyRecordImage}
          resizeMode="stretch"
          style={{ aspectRatio: 328 / 136 }}
          imageStyle={{ borderRadius: 16 }}
          className="w-full items-center justify-center gap-4 overflow-hidden rounded-2xl px-4 pt-7"
        >
          <Text className="text-center font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-600">
            작성된 입주기록이 없어요..
          </Text>
          <CTAButton
            label="새로운 집 추가하기"
            active
            onPress={onAddNewHouse}
            widthClassName="w-[188px]"
            heightClassName="h-10"
            radiusClassName="rounded-[10px]"
            paddingClassName="py-2"
            fontsizeClassName="text-[14px]"
          />
        </ImageBackground>
      )}
    </View>
  );
}
