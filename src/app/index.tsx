import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { getAccessToken } from "../lib/tokenStorage";
import { fetchMyProfile } from "../features/auth/hooks/useMyProfile";

// 앱 진입 게이트: 저장된 토큰이 있으면 내 프로필을 조회해 전역 상태를 채운 뒤 홈으로,
// 토큰이 없거나 프로필 조회가 실패(세션 만료)하면 로그인으로 보낸다
export default function Index() {
  const [target, setTarget] = useState<"/home" | "/login" | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) {
        setTarget("/login");
        return;
      }
      try {
        await fetchMyProfile();
        setTarget("/home");
      } catch {
        setTarget("/login");
      }
    })();
  }, []);

  // 토큰 확인 중에는 아무것도 렌더링하지 않음 (네이티브 스플래시가 보이는 구간)
  if (target === null) {
    return null;
  }

  return <Redirect href={target} />;
}
