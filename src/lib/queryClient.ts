import { QueryClient } from "@tanstack/react-query";

// 앱 전체에서 하나의 인스턴스를 공유한다 (리렌더 시 재생성 방지 + 컴포넌트 렌더 밖의
// 훅/서비스 코드에서도 fetchQuery/getQueryData/invalidateQueries 등으로 캐시에
// 접근하기 위해 모듈 스코프로 export한다).
export const queryClient = new QueryClient();
