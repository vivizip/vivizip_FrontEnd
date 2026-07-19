import React, { useState } from "react";
import { Text, View } from "react-native";

import CTAButton from "../../../components/CTAButton";
import WheelPicker from "../../../components/WheelPicker";

export type LanguageOption = "korea" | "vietnam" | "china";

const LANGUAGE_ITEMS: { value: LanguageOption; label: string }[] = [
  { value: "korea", label: "한국" },
  { value: "vietnam", label: "베트남" },
  { value: "china", label: "중국" },
];

type Props = {
  value: LanguageOption;
  onConfirm: (value: LanguageOption) => void;
};

/**
 * 마이페이지 "내 정보" KR 칩을 누르면 뜨는 언어 선택 바텀시트 (Figma node 1413:17956, "언어 선택").
 * 휠 자체는 공용 WheelPicker를 쓰고, 여기서는 로컬 draft 선택 상태를 들고 있다가
 * "입력 완료"를 눌러야 onConfirm으로 확정한다(취소는 바텀시트 바깥 탭으로 그냥 닫음).
 */
export default function LanguageSelectSheet({ value, onConfirm }: Props) {
  const [selected, setSelected] = useState<LanguageOption>(value);

  return (
    <View className="w-full items-center gap-2">
      <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-500">
        언어를 선택해 주세요
      </Text>

      <WheelPicker items={LANGUAGE_ITEMS} value={selected} onChange={setSelected} />

      <View className="w-full pt-4">
        <CTAButton
          label="입력 완료"
          active
          onPress={() => onConfirm(selected)}
        />
      </View>
    </View>
  );
}
