import axios from "axios";

/**
 * 앱 전역에서 공용으로 쓰는 axios 인스턴스.
 *
 * baseURL은 환경변수 EXPO_PUBLIC_API_URL에서 읽는다.
 * - 값은 .env(로컬) 또는 eas.json의 프로파일별 env(빌드)에서 주입된다.
 * - EXPO_PUBLIC_ 접두사 변수는 빌드 시 번들에 평문으로 포함되므로 비밀값을 넣지 말 것.
 * - 반드시 정적 dot 표기(process.env.EXPO_PUBLIC_API_URL)로 접근해야 인라인된다.
 */
const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  // 개발 중 환경변수 누락을 조용히 넘기지 않도록 경고
  console.warn(
    "[api] EXPO_PUBLIC_API_URL이 설정되지 않았습니다. .env 파일을 확인하세요.",
  );
}

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
