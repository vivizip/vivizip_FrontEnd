import React from "react";
import { Text, View } from "react-native";

import IdeaIcon from "../../../../assets/icons/icons8_idea.svg";

type Props = {
  children: string;
};

/**
 * 온보딩 1~3단계에 쓰이는 "아이디어 팁" 카드 (Figma node 1212:14968 등).
 * 흰 배경 + 옅은 파란 그림자, 좌측 idea 아이콘 + 안내 문구.
 */
export default function IdeaTipCard({ children }: Props) {
  return (
    <View
      className="w-full flex-row items-center gap-2 rounded-xl bg-white px-4 py-3"
      style={{
        shadowColor: "#A0CFFF",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <IdeaIcon width={19} height={19} />
      <Text className="flex-1 font-pretendard-semibold text-12 font-semibold leading-[normal] tracking-[-0.12px] text-gray-600">
        {children}
      </Text>
    </View>
  );
}
