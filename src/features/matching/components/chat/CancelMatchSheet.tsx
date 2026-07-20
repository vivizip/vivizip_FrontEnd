import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import CTAButton from "../../../../components/CTAButton";
import { useAuthUserStore } from "../../../auth/store/useAuthUserStore";

const checkIcon = require("../../../../../assets/icons/ic_check_small.png");

// 부모(BottomSheet/Animated.View)가 auto-height라 퍼센트나 flex:1로는 실제 스크롤 영역을
// 만들 수 없어서, 화면 높이 기준 고정 px 값으로 직접 뷰포트 높이를 준다. 시트/버튼 위치는
// 이 값과 무관하게 항상 고정이고, 이 안에서만 내용이 스크롤된다.
const SCROLL_VIEWPORT_HEIGHT = Dimensions.get("window").height * 0.4;

// TODO(프로필 조회 실패 대비): getMyProfile 실패 등으로 user가 비어있을 때만 fallback 문구를 쓴다.
const FALLBACK_USER_NAME = "회원";

type Props = {
  reason: string;
  onChangeReason: (reason: string) => void;
  onConfirmRematch: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

/**
 * 채팅방 케밥 메뉴 "매칭 취소하기" 바텀시트 (Figma node 1176:14408 하단, "재매칭").
 * BottomSheet 공용 프레임(px-4 pt-6 pb-[80px])을 그대로 써서 자체 좌우/하단 패딩은 없다.
 * 시트 자체와 CTA 버튼 위치는 키보드와 무관하게 항상 고정이다 - 대신 안내문구/입력란을
 * 감싼 ScrollView의 콘텐츠 하단에 키보드 높이만큼 여유 패딩을 줘서, 포커스된 TextInput이
 * RN 기본 동작(포커스된 입력칸을 ScrollView 안에서 보이는 위치까지 자동 스크롤)으로
 * 키보드 위까지 올라올 수 있는 스크롤 여유 공간을 만들어준다.
 * 재매칭은 POST /api/matches/{matchId}/rematch로 연결됨(MateChatScreen이 실제 호출 담당).
 */
export default function CancelMatchSheet({
  reason,
  onChangeReason,
  onConfirmRematch,
  onCancel,
  isSubmitting,
}: Props) {
  const canSubmit = reason.trim().length > 0 && !isSubmitting;
  const currentUserName =
    useAuthUserStore((state) => state.user?.nickname) ?? FALLBACK_USER_NAME;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (event) =>
      setKeyboardHeight(event.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View className="w-full">
      <ScrollView
        style={{ maxHeight: SCROLL_VIEWPORT_HEIGHT + 150 }}
        contentContainerStyle={{ paddingBottom: keyboardHeight }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full gap-6">
          <View className="w-full gap-4">
            <View className="w-full">
              <Text className="w-full font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-800">
                {currentUserName}님
              </Text>
              <Text className="w-full font-pretendard-semibold text-18 font-semibold leading-[26px] text-gray-800">
                정말 매칭을 취소하시겠어요?
              </Text>
            </View>

            <View className="w-full gap-2">
              <View className="w-full flex-row items-center gap-2">
                <Image
                  source={checkIcon}
                  className="h-4 w-4"
                  resizeMode="contain"
                />
                <Text className="font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
                  재매칭은 최대 3회까지 가능해요
                </Text>
              </View>
              <View className="w-full flex-row items-start gap-2">
                <Image
                  source={checkIcon}
                  className="h-4 w-4"
                  resizeMode="contain"
                />
                <Text className="flex-1 font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
                  이유없는 매칭 취소의 경우, 이후 VIVIZIP의 서비스 이용이
                  어려워요
                </Text>
              </View>
            </View>
          </View>

          <View className="w-full gap-2">
            <View className="flex-row items-start">
              <Text className="font-pretendard-semibold text-14 font-semibold leading-5 text-gray-800">
                재매칭 이유를 알려주세요. (필수입력)
              </Text>
              <Text className="font-pretendard-semibold text-14 font-semibold leading-5 text-[#FF3B30]">
                {" "}
                *
              </Text>
            </View>
            <TextInput
              value={reason}
              onChangeText={onChangeReason}
              multiline
              textAlignVertical="top"
              placeholder={
                "더 나은 매칭을 위해 재매칭을 원하는 이유를 알려주세요.\n(예시: 일정이 맞지 않아요 / 원하는 지역이 달라요 / 연락이 잘 되지 않아요)"
              }
              placeholderTextColor="#9FA5AF"
              className="h-[120px] w-full rounded-lg bg-gray-50 p-3 font-pretendard text-12 leading-4 text-gray-800"
            />
          </View>
        </View>
      </ScrollView>

      <View className="w-full gap-1 pt-10">
        <CTAButton
          label="재매칭하기"
          active={canSubmit}
          onPress={onConfirmRematch}
        />
        <CTAButton
          label="돌아가기"
          active
          onPress={onCancel}
          bgClassName="bg-white active:opacity-70"
          textClassName="text-gray-400"
        />
      </View>
    </View>
  );
}
