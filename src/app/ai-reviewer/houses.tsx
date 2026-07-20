import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import AddressList from "../../features/ai-reviewer/components/houses/AddressList";
import type { RegisteredAddress } from "../../features/ai-reviewer/components/houses/AddressListItem";
import { useRegisteredHouseStore } from "../../features/ai-reviewer/store/useRegisteredHouseStore";
import BottomSheet, {
  type BottomSheetItem,
} from "../../components/BottomSheet";
import PopupS from "../../components/PopupS";
import TopBar from "../../components/TopBar";
import { SCREEN_PADDING } from "../../lib/layout";

const backIcon = require("../../../assets/icons/ic_left.png");
const setCurrentIcon = require("../../../assets/icons/ic_location_empty.png");
const deleteIcon = require("../../../assets/icons/ic_delete.png");

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (실제 시트 높이보다 크면 됨)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

type ConfirmState =
  | { type: "setCurrent"; address: RegisteredAddress }
  | { type: "delete"; address: RegisteredAddress };

export default function RegisteredHousesScreen() {
  const router = useRouter();
  const houses = useRegisteredHouseStore((state) => state.houses);
  const currentHouseId = useRegisteredHouseStore(
    (state) => state.currentHouseId,
  );
  const setCurrentHouse = useRegisteredHouseStore(
    (state) => state.setCurrentHouse,
  );
  const removeHouse = useRegisteredHouseStore((state) => state.removeHouse);
  const addresses: RegisteredAddress[] = houses.map((house) => ({
    ...house,
    isCurrent: house.id === currentHouseId,
  }));
  const [menuAddress, setMenuAddress] = useState<RegisteredAddress | null>(
    null,
  );
  // Modal은 visible=false가 되는 즉시 사라지므로, 닫힘 애니메이션이 끝날 때까지는 마운트를 유지
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  // 배경: opacity 0 -> 0.25 (fade) / 시트: translateY SHEET_OFFSCREEN_Y -> 0 (slide up)
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (menuAddress) {
      setIsModalMounted(true);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0.25,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [menuAddress, overlayOpacity, sheetTranslateY]);

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_OFFSCREEN_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalMounted(false);
      setMenuAddress(null);
    });
  };

  const handleCancelConfirm = () => setConfirmState(null);

  const handleConfirm = () => {
    if (!confirmState) return;
    const { type, address } = confirmState;

    if (type === "setCurrent") {
      setCurrentHouse(address.id);
      setConfirmState(null);
      // 설정 완료 후 AI 서류 검토 첫 화면(탭)으로 복귀
      router.replace("/ai-reviewer");
      return;
    }

    // TODO: 실제 삭제(백엔드 API) 연동 전까지 로컬 상태(스토어)에서만 제거
    removeHouse(address.id);
    setConfirmState(null);
  };

  const menuItems: BottomSheetItem[] = menuAddress
    ? [
        {
          icon: setCurrentIcon,
          label: "현재 집으로 설정하기",
          onPress: () => {
            setConfirmState({ type: "setCurrent", address: menuAddress });
            closeMenu();
          },
        },
        {
          icon: deleteIcon,
          label: "주소 삭제하기",
          onPress: () => {
            setConfirmState({ type: "delete", address: menuAddress });
            closeMenu();
          },
        },
      ]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="주소 검색"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: SCREEN_PADDING.horizontal,
          paddingTop: SCREEN_PADDING.top,
          paddingBottom: SCREEN_PADDING.bottom,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-6">
          <AddressList
            addresses={addresses}
            onPressKebab={(address) => setMenuAddress(address)}
          />
        </View>
      </ScrollView>

      <Modal
        visible={isModalMounted}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          {/* 배경: fade (Figma: gray-900, opacity 0~0.25) */}
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#121619",
              opacity: overlayOpacity,
            }}
          />
          {/* 배경 탭 시 닫기 */}
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeMenu}
          />
          {/* 시트: slide up */}
          <Animated.View
            style={{ transform: [{ translateY: sheetTranslateY }] }}
          >
            <BottomSheet items={menuItems} />
          </Animated.View>
        </View>
      </Modal>

      {/* 현재 집 설정 / 삭제 확인 팝업 */}
      <Modal
        visible={confirmState !== null}
        transparent
        animationType="fade"
        onRequestClose={handleCancelConfirm}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(18, 22, 25, 0.25)",
          }}
        >
          {confirmState?.type === "setCurrent" && (
            <PopupS
              title="아래 주소를 현재 집으로 설정할까요?"
              subtitle={confirmState.address.title}
              cancelLabel="취소"
              confirmLabel="설정하기"
              onCancel={handleCancelConfirm}
              onConfirm={handleConfirm}
            />
          )}
          {confirmState?.type === "delete" && (
            <PopupS
              title="해당주소를 삭제할까요?"
              subtitle="주소지를 삭제해도 발급된 서류는 사라지지않아요"
              cancelLabel="취소"
              confirmLabel="삭제하기"
              onCancel={handleCancelConfirm}
              onConfirm={handleConfirm}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
