import { api } from "../../../lib/api";

export type OptionItem = {
  code: string;
  label: string;
};

const NATIONALITIES_ENDPOINT = "/api/options/nationalities";
const LANGUAGES_ENDPOINT = "/api/options/languages";
const GENDERS_ENDPOINT = "/api/options/genders";

/** 국적 선택지 목록(코드+한글 라벨) 조회. */
export const getNationalityOptions = async (): Promise<OptionItem[]> => {
  const { data } = await api.get<OptionItem[]>(NATIONALITIES_ENDPOINT);
  console.log("[Options API] getNationalityOptions response:", data);
  return data;
};

/** 언어 선택지 목록(코드+한글 라벨) 조회. */
export const getLanguageOptions = async (): Promise<OptionItem[]> => {
  const { data } = await api.get<OptionItem[]>(LANGUAGES_ENDPOINT);
  console.log("[Options API] getLanguageOptions response:", data);
  return data;
};

/** 성별 선택지 목록(코드+한글 라벨) 조회. */
export const getGenderOptions = async (): Promise<OptionItem[]> => {
  const { data } = await api.get<OptionItem[]>(GENDERS_ENDPOINT);
  console.log("[Options API] getGenderOptions response:", data);
  return data;
};
