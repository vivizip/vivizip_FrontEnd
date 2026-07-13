import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * PopupS 공통 컴포넌트 (Figma) - 예/아니오 확인 팝업 카드
 * - 프레임: width 328px, padding 20px 16px 12px 16px, column, items center, gap 32px
 * - 스타일: radius 16px, bg #FFF, shadow 0 0 10px rgba(0,0,0,0.08)
 * - 버튼: 각 144px, padding 8px 0, radius 12px, gap 8px
 *   (버튼 gap은 스펙에 없어서 328 - 좌우패딩32 - 144*2 = 8px로 역산)
 * - 카드 자체만 그린다. 오버레이/화면 중앙 정렬은 호출부에서 Modal로 감쌀 것.
 */
export default function PopupS({
  title,
  subtitle,
  cancelLabel = "아니오",
  confirmLabel = "예",
  onCancel,
  onConfirm,
}: Props) {
  return (
    <View
      className="w-[328px] flex-col items-center gap-8 rounded-2xl bg-white pb-3 pl-4 pr-4 pt-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6, // Android는 shadow* 대신 elevation 사용
      }}
    >
      <View className="w-full items-start gap-2">
        <Text className="text-left font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-900">
          {title}
        </Text>
        <Text className="text-left font-pretendard-medium text-14 font-medium leading-5 text-gray-600">
          {subtitle}
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={onCancel}
          className="w-[144px] items-center justify-center rounded-xl bg-gray-50 py-2 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
        >
          <Text className="text-center font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
            {cancelLabel}
          </Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          className="w-[144px] items-center justify-center rounded-xl bg-primary-500 py-2 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel={confirmLabel}
        >
          <Text className="text-center font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-50">
            {confirmLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
