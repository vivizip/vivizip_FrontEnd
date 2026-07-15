import React, { useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import TopBar from "../../../components/TopBar";
import ChipM from "../../../components/ChipM";
import PhotoPager from "../../../features/ai-reviewer/components/move-in-record/PhotoPager";
import { useMoveInRecordStore } from "../../../features/ai-reviewer/store/useMoveInRecordStore";

const backIcon = require("../../../../assets/icons/ic_left.png");
const kebabIcon = require("../../../../assets/icons/ic_kebab.png");
const closeIcon = require("../../../../assets/icons/ic_x.png");

/**
 * 입주 기록 상세 확인 화면 (Figma node 1064:9818, "기록장 세부 확인")
 * "수정"을 누르면 같은 화면이 편집 모드로 전환된다 (Figma node 1095:10536, "수정중"):
 * - 사진 우상단에 삭제 버튼, 하자 칩에 X 버튼, 내용은 편집 가능한 입력창으로 바뀌고
 * - CTA가 "수정/확인" 2버튼에서 "입력 완료" 단일 버튼으로 바뀐다
 * TopBar 케밥 아이콘을 누르면 "삭제하기" 드롭다운이 뜬다 (RecordSortMenu와 동일한 Modal 패턴)
 */
export default function MoveInRecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const record = useMoveInRecordStore((state) =>
    state.records.find((item) => item.id === id),
  );
  const updateRecord = useMoveInRecordStore((state) => state.updateRecord);
  const deleteRecord = useMoveInRecordStore((state) => state.deleteRecord);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedIssues, setEditedIssues] = useState<string[]>([]);
  const [editedPhotoUris, setEditedPhotoUris] = useState<string[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 0 });
  const topBarRef = useRef<View>(null);

  const handleEdit = () => {
    if (!record) return;
    setEditedContent(record.content);
    setEditedIssues(record.issues);
    setEditedPhotoUris(record.photoUris);
    setIsEditing(true);
  };

  const handleRemoveIssue = (issue: string) => {
    setEditedIssues((prev) => prev.filter((item) => item !== issue));
  };

  const handleRemovePhoto = (uri: string) => {
    setEditedPhotoUris((prev) => prev.filter((item) => item !== uri));
  };

  const handleSave = () => {
    if (!record) return;
    updateRecord(record.id, {
      content: editedContent,
      issues: editedIssues,
      photoUris: editedPhotoUris,
    });
    setIsEditing(false);
  };

  const openMenu = () => {
    topBarRef.current?.measureInWindow((x, y, width, height) => {
      const windowWidth = Dimensions.get("window").width;
      setMenuAnchor({ top: y + height + 14, right: windowWidth - (x + width) });
      setIsMenuOpen(true);
    });
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleDelete = () => {
    if (!record) return;
    closeMenu();
    deleteRecord(record.id);
    router.back();
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View ref={topBarRef} collapsable={false}>
        <TopBar
          title={record.address}
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

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            {isEditing ? (
              <PhotoPager
                photoUris={editedPhotoUris}
                onRemovePhoto={handleRemovePhoto}
              />
            ) : (
              <PhotoPager photoUris={record.photoUris} />
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
                  {record.content}
                </Text>
              )}
            </View>

            <View className="w-full flex-row flex-wrap items-center justify-end gap-2.5 px-4 pb-3">
              {(isEditing ? editedIssues : record.issues).map((issue) => (
                <ChipM
                  key={issue}
                  label={issue}
                  icon={isEditing ? closeIcon : undefined}
                  onIconPress={
                    isEditing ? () => handleRemoveIssue(issue) : undefined
                  }
                  bgClassName="bg-primary-100"
                  textClassName="text-primary-500"
                />
              ))}
            </View>
          </View>

          {isEditing ? (
            <Pressable
              onPress={handleSave}
              className="mt-9 h-11 w-full items-center justify-center rounded-2xl bg-primary-500 active:opacity-80"
              accessibilityRole="button"
              accessibilityLabel="입력 완료"
            >
              <Text className="font-pretendard-semibold text-16 font-semibold leading-6 tracking-[-0.16px] text-white">
                입력 완료
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
