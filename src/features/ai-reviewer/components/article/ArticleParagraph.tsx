import React from "react";
import { Text } from "react-native";

type Props = {
  children: React.ReactNode;
};

/**
 * 아티클 본문 공통 문단 스타일 (Body/body-s, gray-800)
 */
export default function ArticleParagraph({ children }: Props) {
  return (
    <Text className="w-full font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-800">
      {children}
    </Text>
  );
}
