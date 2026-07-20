import { isAxiosError } from "axios";

import { api } from "../../../lib/api";
import type { ApiEnvelope } from "../../../types/api";

const NEAREST_ADDRESS_ENDPOINT = "/api/places/nearest-address";
const PLACE_SEARCH_ENDPOINT = "/api/places/search";

export type PlaceSearchItem = {
  placeName: string;
  category: string;
  roadAddress: string;
  longitude: number;
  latitude: number;
  distance: number;
};

export type PlaceSearchResponse = {
  places: PlaceSearchItem[];
  isEnd: boolean;
};

export type PlaceSearchParams = {
  query: string;
  /** 중심경도. 좌표를 같이 주면 결과의 distance가 계산된다. */
  x?: number;
  /** 중심위도. */
  y?: number;
  page?: number;
  size?: number;
  sort?: "accuracy" | "distance";
};

/** 키워드로 장소를 검색한다. */
export const searchPlaces = async (
  params: PlaceSearchParams,
): Promise<PlaceSearchResponse> => {
  try {
    const { data } = await api.get<PlaceSearchResponse>(PLACE_SEARCH_ENDPOINT, {
      params,
    });
    return data;
  } catch (err) {
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<never> | undefined;
      if (envelope?.message) {
        throw new Error(envelope.message);
      }
    }
    throw err;
  }
};

/** 경도(x)·위도(y) 기준 가장 가까운 건물의 도로명 주소 1개를 조회한다. */
export const getNearestAddress = async (
  x: number,
  y: number,
): Promise<string> => {
  try {
    const { data } = await api.get<{ address: string }>(
      NEAREST_ADDRESS_ENDPOINT,
      { params: { x, y } },
    );
    return data.address;
  } catch (err) {
    if (isAxiosError(err)) {
      const envelope = err.response?.data as ApiEnvelope<never> | undefined;
      if (envelope?.message) {
        throw new Error(envelope.message);
      }
    }
    throw err;
  }
};
