import { useQuery } from "@tanstack/react-query";

import { queryClient } from "../../../lib/queryClient";
import { getMyProfile, type MyProfileResponse } from "../services/authApi";

/** GET /api/users/me 캐시 키. */
export const PROFILE_QUERY_KEY = ["profile"] as const;

// 로그인/자동 로그인/학교 인증 완료 시점에만 명시적으로 채우거나 무효화하므로,
// 화면을 오갈 때마다 자동 재요청하지 않도록 어느 정도 fresh하게 유지한다.
const PROFILE_STALE_TIME_MS = 5 * 60 * 1000;

/**
 * 내 프로필(GET /api/users/me)을 구독하는 훅. 로그인된 사용자만 볼 수 있는 화면
 * (탭/매칭 스택 등)에서 쓴다 - 로그인 전 화면에서 쓰면 401을 유발할 수 있다.
 */
export const useMyProfile = () =>
  useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    staleTime: PROFILE_STALE_TIME_MS,
  });

/** 로그인 성공/자동 로그인 시 프로필을 가져와 캐시를 채운다 (실패하면 throw). */
export const fetchMyProfile = () =>
  queryClient.fetchQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: getMyProfile });

/** 이벤트 핸들러 등 렌더 바깥에서 현재 캐시된 프로필을 읽는다 (없으면 undefined). */
export const getCachedProfile = (): MyProfileResponse | undefined =>
  queryClient.getQueryData(PROFILE_QUERY_KEY);

/** 서버 값이 바뀐 뒤(예: 학교 인증 완료) 캐시를 무효화해 구독 중인 화면을 최신화한다. */
export const invalidateMyProfile = () =>
  queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

/** 로그아웃/탈퇴 시 캐시를 비운다. */
export const clearMyProfile = () =>
  queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
