import React from "react";
import { Text, View } from "react-native";

export type AddressSearchResult = {
  title: string;
  description: string;
};

type Props = {
  result: AddressSearchResult;
  /** 사용자가 입력한 검색어 - title에서 일치하는 부분만 파란색으로 강조 */
  query: string;
};

function splitByQuery(title: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [{ text: title, matched: false }];
  const index = title.indexOf(trimmed);
  if (index === -1) return [{ text: title, matched: false }];
  return [
    { text: title.slice(0, index), matched: false },
    { text: title.slice(index, index + trimmed.length), matched: true },
    { text: title.slice(index + trimmed.length), matched: false },
  ].filter((part) => part.text.length > 0);
}

/**
 * 주소 검색 결과 한 줄 (Figma)
 * - 레이아웃: column, items flex-start, gap 4px, self stretch
 * - 타이틀: Body/body-s (Pretendard 14/600, lh 22) - 입력어 일치 구간만 primary-600, 나머지 gray-900
 * - 설명: Label/Label-s (Pretendard 12/600, lh 18), gray-600
 */
export default function SearchResultItem({ result, query }: Props) {
  const segments = splitByQuery(result.title, query);

  return (
    <View className="w-full flex-col items-start gap-1">
      <Text className="font-pretendard text-14 font-semibold leading-[22px]">
        {segments.map((segment, index) => (
          <Text
            key={index}
            className={segment.matched ? "text-primary-600" : "text-gray-900"}
          >
            {segment.text}
          </Text>
        ))}
      </Text>
      <Text className="font-pretendard text-12 font-semibold leading-[18px] text-gray-600">
        {result.description}
      </Text>
    </View>
  );
}
