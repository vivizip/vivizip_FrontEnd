import React, { useState } from "react";
import { ImageBackground, ScrollView, Text, View } from "react-native";

import CTAButton from "../../../../components/CTAButton";
import RecordSortMenu, { type SortOrder } from "./RecordSortMenu";
import MoveInRecordCard from "./MoveInRecordCard";
import type { MoveInRecord } from "../../store/useMoveInRecordStore";

const emptyRecordImage = require("../../../../../assets/images/img_empty_record.png");

type Props = {
  records: MoveInRecord[];
  onAddNewHouse: () => void;
  onPressRecord: (record: MoveInRecord) => void;
};

/**
 * "입주 기록 리스트" 섹션
 * - 기록 없음(Figma node 1082:10171 / 빈 상태 카드 1095:9641): 폴더 일러스트 + 새로운 집 추가 버튼
 * - 기록 있음(Figma node 1078:9605): 기록 카드 가로 스크롤 리스트, 카드를 누르면 상세 화면으로 이동
 */
export default function RecordListSection({
  records,
  onAddNewHouse,
  onPressRecord,
}: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const hasRecords = records.length > 0;
  const sortedRecords = [...records].sort((a, b) =>
    sortOrder === "recent"
      ? b.createdAt - a.createdAt
      : a.createdAt - b.createdAt,
  );

  return (
    <View className="w-full gap-4">
      <View className="w-full flex-row items-center justify-between">
        <Text className="text-title-m text-gray-800">입주 기록 리스트</Text>
        <RecordSortMenu value={sortOrder} onChange={setSortOrder} />
      </View>

      {hasRecords ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {sortedRecords.map((record) => (
              <MoveInRecordCard
                key={record.id}
                record={record}
                onPress={() => onPressRecord(record)}
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
