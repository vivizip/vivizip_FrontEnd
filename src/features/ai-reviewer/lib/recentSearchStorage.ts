import * as SecureStore from "expo-secure-store";

/**
 * 주소 검색 화면의 "최근 검색어" 보관소.
 * tokenStorage.ts/onboardingStorage.ts와 동일하게 expo-secure-store에 JSON
 * 문자열로 저장한다 - 최신순으로 최대 MAX_KEYWORDS개까지만 유지.
 */

const RECENT_KEYWORDS_KEY = "search.recentKeywords";
const MAX_KEYWORDS = 10;

export const getRecentKeywords = async (): Promise<string[]> => {
  const raw = await SecureStore.getItemAsync(RECENT_KEYWORDS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** 검색어를 최근 검색어 맨 앞에 추가한다(중복이면 앞으로 끌어올림). */
export const addRecentKeyword = async (keyword: string): Promise<string[]> => {
  const trimmed = keyword.trim();
  if (!trimmed) return getRecentKeywords();
  const current = await getRecentKeywords();
  const next = [trimmed, ...current.filter((k) => k !== trimmed)].slice(
    0,
    MAX_KEYWORDS,
  );
  await SecureStore.setItemAsync(RECENT_KEYWORDS_KEY, JSON.stringify(next));
  return next;
};

export const removeRecentKeyword = async (
  keyword: string,
): Promise<string[]> => {
  const current = await getRecentKeywords();
  const next = current.filter((k) => k !== keyword);
  await SecureStore.setItemAsync(RECENT_KEYWORDS_KEY, JSON.stringify(next));
  return next;
};
