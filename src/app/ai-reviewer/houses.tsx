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

const backIcon = require("../../../assets/icons/ic_left.png");
const setCurrentIcon = require("../../../assets/icons/ic_location_empty.png");
const deleteIcon = require("../../../assets/icons/ic_delete.png");

// TODO: 여러 집 등록 데이터 모델(store) 연동 전까지 임시 목데이터
const INITIAL_MOCK_ADDRESSES: RegisteredAddress[] = [
  {
    id: "1",
    title: "강남구 역삼동 790-6",
    subtitle: "서울 강남구 역삼로 180 마루 180",
    isCurrent: true,
  },
  {
    id: "2",
    title: "충무로2가 65-4",
    subtitle: "서울 중구 명동10길 52 신한 익스페이스",
    isCurrent: false,
  },
  {
    id: "3",
    title: "강서구 가양동 24-8",
    subtitle: "서울 강서구 허준대로 10 방토빌라",
    isCurrent: false,
  },
];

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (실제 시트 높이보다 크면 됨)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

type ConfirmState =
  | { type: "setCurrent"; address: RegisteredAddress }
  | { type: "delete"; address: RegisteredAddress };

export default function RegisteredHousesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<RegisteredAddress[]>(
    INITIAL_MOCK_ADDRESSES,
  );
  const setRegisteredAddress = useRegisteredHouseStore(
    (state) => state.setAddress,
  );
  const clearRegisteredAddress = useRegisteredHouseStore(
    (state) => state.clearAddress,
  );
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
      setAddresses((prev) =>
        prev.map((item) => ({ ...item, isCurrent: item.id === address.id })),
      );
      setRegisteredAddress(address.title);
      setConfirmState(null);
      // 설정 완료 후 AI 서류 검토 첫 화면(탭)으로 복귀
      router.replace("/ai-reviewer");
      return;
    } else {
      // TODO: 실제 삭제(백엔드 API) 연동 전까지 로컬 상태에서만 제거
      const next = addresses.filter((item) => item.id !== address.id);
      if (address.isCurrent) {
        if (next.length > 0) {
          // 삭제한 주소가 현재 설정된 집이었다면 최상단 주소를 새 현재 주소로 승격
          next[0] = { ...next[0], isCurrent: true };
          setRegisteredAddress(next[0].title);
        } else {
          // 남은 주소가 없으면 HouseSelector 초기화
          clearRegisteredAddress();
        }
      }
      setAddresses(next);
    }
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
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 40,
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
