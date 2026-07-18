import React, { useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

import CTAButton from "../../../../components/CTAButton";
import MapPreview from "./MapPreview";

const calendarIcon = require("../../../../../assets/icons/lucide_calendar.png");
const dropdownIcon = require("../../../../../assets/icons/ic_dropdown.png");

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const formatAppointmentDate = (date: Date) => {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekday}요일`;
};

const formatAppointmentTime = (time: Date) => {
  const hours24 = time.getHours();
  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(time.getMinutes()).padStart(2, "0");
  return `${period} ${hours12}시 ${minutes}분`;
};

type Props = {
  date: Date;
  onChangeDate: (date: Date) => void;
  time: Date;
  onChangeTime: (time: Date) => void;
  location: string;
  onPressLocation: () => void;
  onConfirm: () => void;
};

/**
 * 채팅방 "약속잡기" 바텀시트 콘텐츠 (Figma node 1119:17374 하단 시트, "약속잡기").
 * BottomSheet 공용 프레임(px-4 pt-6)에 그대로 끼워 넣는 용도라 자체 좌우 패딩은 없다.
 * "날짜"/"시간" 행은 @react-native-community/datetimepicker로 안드로이드 기본
 * DatePickerDialog/TimePickerDialog(iOS는 인라인 피커)를 띄워 실제로 값을 고를 수 있다.
 * "장소" 행은 상위(MateChatScreen)가 관리하는 주소 검색 바텀시트(LocationSearchSheet)를 연다.
 */
export default function AppointmentSheet({
  date,
  onChangeDate,
  time,
  onChangeTime,
  location,
  onPressLocation,
  onConfirm,
}: Props) {
  const [activeIosPicker, setActiveIosPicker] = useState<
    "date" | "time" | null
  >(null);

  const handlePressDate = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date,
        mode: "date",
        onChange: (event, selectedDate) => {
          if (event.type === "set" && selectedDate) {
            onChangeDate(selectedDate);
          }
        },
      });
    } else {
      setActiveIosPicker((prev) => (prev === "date" ? null : "date"));
    }
  };

  const handlePressTime = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: time,
        mode: "time",
        is24Hour: false,
        onChange: (event, selectedTime) => {
          if (event.type === "set" && selectedTime) {
            onChangeTime(selectedTime);
          }
        },
      });
    } else {
      setActiveIosPicker((prev) => (prev === "time" ? null : "time"));
    }
  };

  return (
    <View className="w-full gap-8">
      <View className="w-full gap-2">
        <View className="w-full flex-row items-center gap-2">
          <Image
            source={calendarIcon}
            className="h-6 w-6"
            resizeMode="contain"
          />
          <Text className="font-pretendard-semibold text-18 font-semibold leading-[26px] text-black">
            약속잡기
          </Text>
        </View>
        <View className="h-px w-full bg-gray-100" />
      </View>

      <View className="w-full gap-2">
        <View className="w-full flex-row items-center justify-between py-2">
          <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
            날짜
          </Text>
          <Pressable
            onPress={handlePressDate}
            className="flex-row items-center gap-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="날짜 선택"
          >
            <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
              {formatAppointmentDate(date)}
            </Text>
            <Image
              source={dropdownIcon}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {Platform.OS === "ios" && activeIosPicker === "date" && (
          <DateTimePicker
            value={date}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              if (event.type === "set" && selectedDate) {
                onChangeDate(selectedDate);
              }
              setActiveIosPicker(null);
            }}
          />
        )}

        <View className="w-full flex-row items-center justify-between py-2">
          <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
            시간
          </Text>
          <Pressable
            onPress={handlePressTime}
            className="flex-row items-center gap-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="시간 선택"
          >
            <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
              {formatAppointmentTime(time)}
            </Text>
            <Image
              source={dropdownIcon}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </Pressable>
        </View>

        {Platform.OS === "ios" && activeIosPicker === "time" && (
          <DateTimePicker
            value={time}
            mode="time"
            display="spinner"
            onChange={(event, selectedTime) => {
              if (event.type === "set" && selectedTime) {
                onChangeTime(selectedTime);
              }
              setActiveIosPicker(null);
            }}
          />
        )}

        <View className="w-full flex-row items-center justify-between py-2">
          <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
            장소
          </Text>
          <Pressable
            onPress={onPressLocation}
            className="flex-row items-center gap-2 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel="장소 선택"
          >
            <Text className="font-pretendard-medium text-16 font-medium leading-6 text-gray-900">
              {location}
            </Text>
            <Image
              source={dropdownIcon}
              className="h-6 w-6"
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <MapPreview width="100%" height={140} />
      </View>

      <CTAButton
        label="약속 잡기"
        active
        onPress={onConfirm}
        heightClassName="h-11"
        radiusClassName="rounded-2xl"
        fontsizeClassName="text-18"
      />
    </View>
  );
}
