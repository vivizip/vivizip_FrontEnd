import React from "react";
import { Text, View } from "react-native";

import MapPreview from "./MapPreview";
import type { Appointment } from "../../services/appointmentApi";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatCardDateTime = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const hours24 = date.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일 ${period} ${hours12}:${minutes}`;
};

type Props = {
  appointment: Appointment;
};

/**
 * 채팅방 상단에 고정 표시되는 약속 확정 카드.
 * TODO(Figma 스펙 미확인): MapPreview.tsx가 "채팅방 약속 확정 카드"를 언급하지만 정확한
 * node를 찾지 못해, MapPreview + 장소/일시 텍스트로 눈대중 구성 - 정확한 노드 확인되면 보정할 것.
 */
export default function AppointmentCard({ appointment }: Props) {
  return (
    <View className="w-full flex-row items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3">
      <MapPreview width={56} height={56} pinSize={20} />
      <View className="flex-1 gap-1">
        <Text
          numberOfLines={1}
          className="font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-900"
        >
          {appointment.placeName}
        </Text>
        <Text className="font-pretendard-medium text-12 font-medium leading-4 text-gray-600">
          {formatCardDateTime(appointment.scheduledAt)}
        </Text>
      </View>
    </View>
  );
}
