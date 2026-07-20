import React, { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../../components/TopBar";
import CTAButton from "../../../components/CTAButton";
import IssueChipSelector from "../../../features/ai-reviewer/components/move-in-record/IssueChipSelector";
import RecordContentInput from "../../../features/ai-reviewer/components/move-in-record/RecordContentInput";
import RecordPhotoPicker from "../../../features/ai-reviewer/components/move-in-record/RecordPhotoPicker";
import {
  DEFECT_TYPE_BY_LABEL,
  createMoveInRecord,
} from "../../../features/ai-reviewer/services/moveInRecordApi";
import { useRegisteredHouseStore } from "../../../features/ai-reviewer/store/useRegisteredHouseStore";
import { SCREEN_PADDING } from "../../../lib/layout";
import { useToastStore } from "../../../store/useToastStore";

const backIcon = require("../../../../assets/icons/ic_left.png");

// 사진 첨부 최대 장수 (Figma 사진 슬롯 개수 기준)
const MAX_PHOTOS = 5;
const FALLBACK_SAVE_ERROR = "입주 기록 저장에 실패했어요. 다시 시도해주세요.";

/**
 * 입주 기록 작성 화면 (Figma node 1064:9771)
 * 이름 입력란은 API에 대응 필드가 없어 제거함 - 현재 등록된 집(leaseCaseId) 기준으로 저장된다.
 */
export default function WriteMoveInRecordScreen() {
  const router = useRouter();
  const currentHouseId = useRegisteredHouseStore(
    (state) => state.currentHouseId,
  );
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleConfirm = async () => {
    if (!currentHouseId || isSaving) return;
    setIsSaving(true);
    try {
      await createMoveInRecord({
        leaseCaseId: Number(currentHouseId),
        memo: content,
        defects: selectedIssues.map((label) => DEFECT_TYPE_BY_LABEL[label]),
        files: photoUris,
      });
      router.back();
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar
        title="입주 기록"
        leftIcon={backIcon}
        onPressLeft={() => router.back()}
      />
      <KeyboardAvoidingView className="flex-1" behavior="padding">
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
            <CTAButton
              label={isSaving ? "저장 중..." : "입력 완료"}
              active={!isSaving}
              onPress={handleConfirm}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
