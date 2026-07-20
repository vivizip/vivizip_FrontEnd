import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../../components/TopBar";
import ChipM from "../../../components/ChipM";
import PhotoPager from "../../../features/ai-reviewer/components/move-in-record/PhotoPager";
import IssueChipSelector from "../../../features/ai-reviewer/components/move-in-record/IssueChipSelector";
import CameraIcon from "../../../../assets/icons/ic_camera-bold.svg";
import {
  DEFECT_TYPE_BY_LABEL,
  deleteMoveInRecord,
  getMoveInRecord,
  updateMoveInRecord,
  type MoveInPhoto,
  type MoveInRecordDetail,
} from "../../../features/ai-reviewer/services/moveInRecordApi";
import { useRegisteredHouseStore } from "../../../features/ai-reviewer/store/useRegisteredHouseStore";
import { useToastStore } from "../../../store/useToastStore";

const backIcon = require("../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../assets/icons/ic_kebab.png");

const MAX_PHOTOS = 5;
const FALLBACK_LOAD_ERROR = "입주 기록을 불러오지 못했어요.";
const FALLBACK_SAVE_ERROR = "입주 기록 저장에 실패했어요. 다시 시도해주세요.";
const FALLBACK_DELETE_ERROR = "삭제에 실패했어요. 다시 시도해주세요.";

/**
 * 입주 기록 상세 확인 화면 (Figma node 1064:9818, "기록장 세부 확인")
 * "수정"을 누르면 같은 화면이 편집 모드로 전환된다 (Figma node 1095:10536, "수정중"):
 * - 사진 우상단에 삭제 버튼, 하자 칩에 X 버튼, 내용은 편집 가능한 입력창으로 바뀌고
 * - CTA가 "수정/확인" 2버튼에서 "입력 완료" 단일 버튼으로 바뀐다
 * TopBar 케밥 아이콘을 누르면 "삭제하기" 드롭다운이 뜬다
 *
 * API에는 기록별 "이름" 필드가 없어 leaseCaseId로 등록된 집 주소를 찾아 제목으로 쓴다.
 * 사진 수정은 기존 사진(서버 photo.id, 삭제 시 deletePhotoIds) / 새로 찍은 사진(로컬 uri,
 * 저장 시 addFiles)을 구분해서 관리한다.
 */
export default function MoveInRecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const houses = useRegisteredHouseStore((state) => state.houses);

  const [record, setRecord] = useState<MoveInRecordDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editedContent, setEditedContent] = useState("");
  const [editedIssues, setEditedIssues] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<MoveInPhoto[]>([]);
  const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([]);
  const [newPhotoUris, setNewPhotoUris] = useState<string[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 0 });
  const topBarRef = useRef<View>(null);

  useEffect(() => {
    if (!id) return;
    getMoveInRecord(Number(id))
      .then(setRecord)
      .catch((err) => {
        useToastStore
          .getState()
          .show(err instanceof Error ? err.message : FALLBACK_LOAD_ERROR);
        router.back();
      });
  }, [id, router]);

  const title = record
    ? (houses.find((house) => house.id === `${record.leaseCaseId}`)?.title ??
      "등록된 집")
    : "";

  const handleEdit = () => {
    if (!record) return;
    setEditedContent(record.memo);
    setEditedIssues(record.defects.map((defect) => defect.label));
    setExistingPhotos(record.photos);
    setDeletedPhotoIds([]);
    setNewPhotoUris([]);
    setIsEditing(true);
  };

  const handleToggleIssue = (issue: string) => {
    setEditedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((item) => item !== issue)
        : [...prev, issue],
    );
  };

  const totalPhotoCount = existingPhotos.length + newPhotoUris.length;

  const handleAddPhoto = async () => {
    if (totalPhotoCount >= MAX_PHOTOS) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      console.log("[MoveInRecordDetail] camera permission denied");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets.length > 0) {
      setNewPhotoUris((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (uri: string) => {
    const existing = existingPhotos.find((photo) => photo.fileUrl === uri);
    if (existing) {
      setExistingPhotos((prev) => prev.filter((photo) => photo.id !== existing.id));
      setDeletedPhotoIds((prev) => [...prev, existing.id]);
      return;
    }
    setNewPhotoUris((prev) => prev.filter((item) => item !== uri));
  };

  const handleSave = async () => {
    if (!record || isSaving) return;
    setIsSaving(true);
    try {
      const updated = await updateMoveInRecord(record.id, {
        memo: editedContent,
        defects: editedIssues.map((label) => DEFECT_TYPE_BY_LABEL[label]),
        deletePhotoIds: deletedPhotoIds.length ? deletedPhotoIds : undefined,
        addFiles: newPhotoUris.length ? newPhotoUris : undefined,
      });
      setRecord(updated);
      setIsEditing(false);
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  const openMenu = () => {
    topBarRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get("window").width;
      setMenuAnchor({ top: y + height + 14, right: windowWidth - (x + width) });
      setIsMenuOpen(true);
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleDelete = async () => {
    if (!record) return;
    closeMenu();
    try {
      await deleteMoveInRecord(record.id);
      router.back();
    } catch (err) {
      useToastStore
        .getState()
        .show(err instanceof Error ? err.message : FALLBACK_DELETE_ERROR);
    }
  };

  if (!record) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <TopBar
          title="입주 기록"
          leftIcon={backIcon}
          onPressLeft={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const displayPhotoUris = isEditing
    ? [...existingPhotos.map((photo) => photo.fileUrl), ...newPhotoUris]
    : record.photos.map((photo) => photo.fileUrl);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View ref={topBarRef} collapsable={false}>
        <TopBar
          title={title}
          leftIcon={backIcon}
          onPressLeft={() => router.back()}
          rightIcon={kebabIcon}
          onPressRight={openMenu}
        />
      </View>

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable className="flex-1" onPress={closeMenu}>
          <View
            className="absolute overflow-hidden rounded-xl bg-gray-100"
            style={{ top: menuAnchor.top, right: menuAnchor.right }}
          >
            <Pressable
              onPress={handleDelete}
              className="w-[224px] flex-row items-center justify-between rounded-xl bg-[#FAFAFD] p-3 active:opacity-70"
              accessibilityRole="button"
              accessibilityLabel="삭제하기"
            >
              <Text className="whitespace-nowrap font-pretendard-medium text-14 font-medium leading-5 text-gray-800">
                삭제하기
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 12,
            paddingTop: 32,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-[336px] items-center gap-11 rounded-2xl bg-[#FAFAFD]">
            <PhotoPager
              photoUris={displayPhotoUris}
              onRemovePhoto={isEditing ? handleRemovePhoto : undefined}
            />

            {isEditing && totalPhotoCount < MAX_PHOTOS && (
              <Pressable
                onPress={handleAddPhoto}
                style={{ marginTop: -40, marginRight: 12 }}
                className="h-9 w-9 items-center justify-center self-end rounded-full bg-white"
                accessibilityRole="button"
                accessibilityLabel="사진 추가"
              >
                <CameraIcon width={20} height={20} />
              </Pressable>
            )}

            <View style={{ marginTop: -30 }}>
              {isEditing ? (
                <TextInput
                  value={editedContent}
                  onChangeText={setEditedContent}
                  multiline
                  className="w-[312px] font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-700"
                />
              ) : (
                <Text className="w-[312px] font-pretendard-semibold text-14 font-semibold leading-[22px] text-gray-700">
                  {record.memo}
                </Text>
              )}
            </View>

            {isEditing ? (
              <View className="w-full px-4">
                <IssueChipSelector
                  selected={editedIssues}
                  onToggle={handleToggleIssue}
                  showTitle={false}
                />
              </View>
            ) : (
              <View className="w-full flex-row flex-wrap items-center justify-end gap-2.5 px-4 pb-3">
                {record.defects.map((defect) => (
                  <ChipM
                    key={defect.type}
                    label={defect.label}
                    bgClassName="bg-primary-100"
                    textClassName="text-primary-500"
                  />
                ))}
              </View>
            )}
          </View>

          {isEditing ? (
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className="mt-9 h-11 w-full items-center justify-center rounded-2xl bg-primary-500 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="입력 완료"
            >
              <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-white">
                {isSaving ? "저장 중..." : "입력 완료"}
              </Text>
            </Pressable>
          ) : (
            <View className="mt-9 w-full flex-row justify-center gap-2">
              <Pressable
                onPress={handleEdit}
                className="h-11 w-[164px] items-center justify-center rounded-xl bg-gray-50 active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="수정"
              >
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-gray-600">
                  수정
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.back()}
                className="h-11 w-[164px] items-center justify-center rounded-xl bg-primary-500 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="확인"
              >
                <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-white">
                  확인
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
