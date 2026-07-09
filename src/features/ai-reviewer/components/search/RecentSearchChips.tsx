import React from "react";
import { Text, View } from "react-native";

import ChipM from "../../../../components/ChipM";

const closeIcon = require("../../../../../assets/icons/ic_x.png");

type Props = {
  keywords: string[];
  onRemove: (keyword: string) => void;
};

/**
 * 최근 검색어 섹션 (실제 검색 기록이 있을 때만 상위에서 조건부 렌더링).
 * - 타이틀: Body/body-s (Pretendard 14/600, lh 22), gray-900
 * - 칩: ChipM + ic_x, 텍스트/아이콘 모두 gray-600, Label-m(14/500, lh 20)
 */
export default function RecentSearchChips({ keywords, onRemove }: Props) {
  return (
    <View className="gap-3">
      <Text className="font-pretendard text-14 font-semibold leading-[22px] text-gray-900">
        최근검색어
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {keywords.map((keyword) => (
          <ChipM
            key={keyword}
            label={keyword}
            icon={closeIcon}
            iconTintColor="#626975" // gray-600
            textClassName="text-gray-600 font-medium leading-5"
            bgClassName="bg-gray-50"
            onIconPress={() => onRemove(keyword)}
          />
        ))}
      </View>
    </View>
  );
}
