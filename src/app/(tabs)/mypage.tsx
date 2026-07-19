import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import TopBar from "../../components/TopBar";
import BottomSheet, { type BottomSheetItem } from "../../components/BottomSheet";
import MyInfoSection from "../../features/mypage/components/MyInfoSection";
import UniversityVerifySection from "../../features/mypage/components/UniversityVerifySection";
import AccountSettingsSection from "../../features/mypage/components/AccountSettingsSection";
import MyPageFooterLinks from "../../features/mypage/components/MyPageFooterLinks";
import { clearTokens, getRefreshToken } from "../../lib/tokenStorage";
import { logout } from "../../features/auth/services/authApi";

const kebabIcon = require("../../../assets/icons/ic_kebab.png");
const logoutIcon = require("../../../assets/icons/ic_x.png");

// 시트가 화면 밖에서 시작하도록 하는 충분히 큰 오프셋 (다른 화면과 동일한 패턴)
const SHEET_OFFSCREEN_Y = 400;
const ANIMATION_DURATION = 220;

/**
 * 마이페이지 탭 (Figma node 1705:18196, "마이페이지_인증 전").
 * 상단바 타이틀/뒤로가기는 Figma 원본("주소확인" + back 아이콘)이 다른 화면에서 복사된
 * 흔적으로 보여 탭 루트 화면에 맞게 보정했다(타이틀 "마이페이지", back 제거, kebab만 유지).
 * Figma에는 로그아웃 도출부가 없어 kebab 메뉴에 추가해 기존 로그아웃 기능을 유지한다.
 */
export default function MyPageScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSCREEN_Y)).current;

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuMounted(true);
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
  }, [isMenuOpen, overlayOpacity, sheetTranslateY]);

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
      setIsMenuMounted(false);
      setIsMenuOpen(false);
    });
  };

  const handleLogout = async () => {
    closeMenu();
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (err) {
        // 서버 로그아웃 실패해도 로컬 토큰은 지워서 기기에서는 로그아웃 상태로 만든다
        console.log("[MyPage] Server logout failed:", String(err));
      }
    }
    await clearTokens();
    router.replace("/login");
  };

  const menuItems: BottomSheetItem[] = [
    {
      icon: logoutIcon,
      label: "로그아웃",
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar title="마이페이지" rightIcon={kebabIcon} onPressRight={() => setIsMenuOpen(true)} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 24,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MyInfoSection />
        <UniversityVerifySection />
        <AccountSettingsSection
          pushEnabled={pushEnabled}
          onChangePushEnabled={setPushEnabled}
        />
        <MyPageFooterLinks />
      </ScrollView>

      <Modal
        visible={isMenuMounted}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
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
          <Pressable
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
            onPress={closeMenu}
          />
          <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] }}>
            <BottomSheet items={menuItems} />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
