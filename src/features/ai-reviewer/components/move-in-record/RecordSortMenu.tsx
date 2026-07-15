import React, { useRef, useState } from "react";
import { Dimensions, Image, Modal, Pressable, Text, View } from "react-native";

import CheckIcon from "../../../../../assets/icons/icon_check.svg";

const dropIcon = require("../../../../../assets/icons/icon_drop.png");

export type SortOrder = "recent" | "oldest";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "recent", label: "최근 추가된 항목순으로 정렬" },
  { value: "oldest", label: "오래된 항목순으로 정렬" },
];

const TRIGGER_LABELS: Record<SortOrder, string> = {
  recent: "최신순",
  oldest: "오래된 순",
};

type Props = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
};

/**
 * "최신순" 정렬 선택 드롭다운 (Figma node 1064:9916)
 * - 트리거: "최신순" 텍스트 + icon_drop 아이콘 (4px 간격)
 * - 팝업: bg #FAFAFD 2행 리스트, 선택된 행에만 icon_check 표시, 행 사이 1px 구분선
 */
export default function RecordSortMenu({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get("window").width;
      setAnchor({ top: y + height + 30, right: windowWidth - (x + width) });
      setIsOpen(true);
    });
  };

  const closeMenu = () => setIsOpen(false);

  const handleSelect = (option: SortOrder) => {
    onChange(option);
    closeMenu();
  };

  return (
    <View ref={triggerRef} collapsable={false}>
      <Pressable
        onPress={openMenu}
        className="flex-row items-center gap-1"
        accessibilityRole="button"
        accessibilityLabel="정렬 선택"
      >
        <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-800">
          {TRIGGER_LABELS[value]}
        </Text>
        <Image source={dropIcon} className="h-4 w-4" resizeMode="contain" />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable className="flex-1" onPress={closeMenu}>
          <View
            className="absolute gap-px overflow-hidden rounded-xl bg-gray-100"
            style={{ top: anchor.top, right: anchor.right }}
          >
            {SORT_OPTIONS.map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === SORT_OPTIONS.length - 1;
              const isSelected = option.value === value;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  className={`w-[224px] flex-row items-center justify-between gap-6 bg-[#FAFAFD] p-3 active:opacity-70 ${
                    isFirst ? "rounded-t-xl" : ""
                  } ${isLast ? "rounded-b-xl" : ""}`}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                >
                  <Text className="whitespace-nowrap font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <CheckIcon width={24} height={24} color="#2C74F2" />
                  ) : (
                    <View className="h-6 w-6" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
