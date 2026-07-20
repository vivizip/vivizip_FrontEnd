import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import CTAButton from "../../../components/CTAButton";
import WheelPicker from "../../../components/WheelPicker";
import { getLanguageOptions } from "../../matching/services/optionsApi";
import { useToastStore } from "../../../store/useToastStore";

export type LanguageOption = string;

type Props = {
  value: LanguageOption;
  onConfirm: (value: LanguageOption) => void;
  /** true가 될 때마다(시트를 열 때마다) 목록을 다시 불러온다. */
  isOpen: boolean;
};

/**
 * 마이페이지 "내 정보" KR 칩을 누르면 뜨는 언어 선택 바텀시트 (Figma node 1413:17956, "언어 선택").
 * 이 컴포넌트 자체는 MyInfoSection 마운트 시 한 번만 생성되고 이후 Modal의 visible로만
 * 보였다 숨었다 하므로(언마운트 안 됨), 목록 조회는 마운트 시점이 아니라 isOpen이 true로
 * 바뀔 때마다 실행한다. 휠 자체는 공용 WheelPicker를 쓰고, 여기서는 로컬 draft 선택
 * 상태를 들고 있다가 "입력 완료"를 눌러야 onConfirm으로 확정한다(취소는 바텀시트
 * 바깥 탭으로 그냥 닫음).
 */
export default function LanguageSelectSheet({ value, onConfirm, isOpen }: Props) {
  const [selected, setSelected] = useState<LanguageOption>(value);
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    getLanguageOptions()
      .then((options) => {
        const mapped = options.map((option) => ({
          value: option.code,
          label: option.label,
        }));
        setItems(mapped);
        if (!mapped.some((item) => item.value === selected) && mapped[0]) {
          setSelected(mapped[0].value);
        }
      })
      .catch(() => {
        useToastStore
          .getState()
          .show("언어 목록을 불러오지 못했어요. 다시 시도해주세요.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <View className="w-full items-center gap-2">
      <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-500">
        언어를 선택해 주세요
      </Text>

      {items.length > 0 && (
        <WheelPicker items={items} value={selected} onChange={setSelected} />
      )}

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
