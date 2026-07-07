import { Redirect } from "expo-router";

// 홈 화면이 준비되기 전까지 로그인 화면으로 보낸다
export default function Index() {
  return <Redirect href="/login" />;
}
