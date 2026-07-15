import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../../components/TopBar";
import CTAButton from "../../../components/CTAButton";
import RecordNameInput from "../../../features/ai-reviewer/components/move-in-record/RecordNameInput";
import IssueChipSelector from "../../../features/ai-reviewer/components/move-in-record/IssueChipSelector";
import RecordContentInput from "../../../features/ai-reviewer/components/move-in-record/RecordContentInput";
import RecordPhotoPicker from "../../../features/ai-reviewer/components/move-in-record/RecordPhotoPicker";
import { useMoveInRecordStore } from "../../../features/ai-reviewer/store/useMoveInRecordStore";
import { SCREEN_PADDING } from "../../../lib/layout";

const backIcon = require("../../../../assets/icons/ic_left.png");

// 사진 첨부 최대 장수 (Figma 사진 슬롯 개수 기준)
const MAX_PHOTOS = 5;

/**
 * 입주 기록 작성 화면 (Figma node 1064:9771)
 * TODO(API 대기): 실제 저장/제출 로직은 아직 없음 - 폼 상태는 로컬로만 관리.
 */
export default function WriteMoveInRecordScreen() {
  const router = useRouter();
  const addRecord = useMoveInRecordStore((state) => state.addRecord);
  const [name, setName] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);

  const toggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue],
    );
  };

  const handlePressCamera = async () => {
    if (photoUris.length >= MAX_PHOTOS) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      console.log("[WriteMoveInRecord] camera permission denied");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUris((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    setPhotoUris((prev) => prev.filter((item) => item !== uri));
  };

  const handleConfirm = () => {
    addRecord({ address: name, issues: selectedIssues, content, photoUris });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="입주 기록"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: SCREEN_PADDING.horizontal,
            paddingTop: SCREEN_PADDING.top,
            paddingBottom: SCREEN_PADDING.bottom,
            gap: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <RecordNameInput value={name} onChangeText={setName} />
          <IssueChipSelector selected={selectedIssues} onToggle={toggleIssue} />
          <RecordContentInput value={content} onChangeText={setContent} />
          <View style={{ marginTop: -10 }}>
            <RecordPhotoPicker
              photoUris={photoUris}
              onPressCamera={handlePressCamera}
              onRemovePhoto={handleRemovePhoto}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <CTAButton label="입력 완료" active onPress={handleConfirm} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
