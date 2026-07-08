import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";

import { getAccessToken } from "../lib/tokenStorage";

// 앱 진입 게이트: 저장된 토큰이 있으면 홈, 없으면 로그인으로 보낸다
export default function Index() {
  const [target, setTarget] = useState<"/home" | "/login" | null>(null);

  useEffect(() => {
    getAccessToken()
      .then((token) => setTarget(token ? "/home" : "/login"))
      .catch(() => setTarget("/login"));
  }, []);

  // 토큰 확인 중에는 아무것도 렌더링하지 않음 (네이티브 스플래시가 보이는 구간)
  if (target === null) {
    return null;
  }

  return <Redirect href={target} />;
}
