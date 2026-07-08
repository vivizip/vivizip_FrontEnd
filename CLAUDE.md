@AGENTS.md

# 프로젝트 개요

이 프로젝트는 VIVIZIP이라는 서비스의 **"프론트 엔드"**를 맡아서 개발함.

# 기술스택

이 프로젝트는 아래와 같은 기술스택을 사용함.

- 프레임워크 : react-native / expo
- 언어 : typescript
- 스타일 : tailwind
- 상태 관리: React Query (서버 상태 관리) / Zustand (클라이언트 상태 관리)
- 데이터 패칭: Axios
- 라우팅: Expo Router
- 빌드 : EAS Cloud
- 코드리뷰 : CodeRabbit

# 백엔드 정보

- Firebase (push alram)
- 프레임워크 : Spring
- 언어 : JAVA
- API 문서화: Swagger
- API 테스트 : postman
- DB : MySQL

# 라이브러리

# 폴더구조

src/
├── app/ # Expo Router 파일 기반 라우팅 (폴더/파일 경로 = 화면 경로, main: expo-router/entry)
│ ├── \_layout.tsx # 루트 레이아웃 (global.css, QueryClientProvider, Stack)
│ ├── index.tsx # 진입 게이트(/) - 저장된 토큰 유무로 /home 또는 /login redirect (자동 로그인)
│ ├── (auth)/ # [인증] 라우트 그룹 - URL에 그룹명 미포함
│ │ └── login.tsx # 로그인 화면 (LoginTitle + KakaoLoginButton + NonMemberButton 조립)
│ └── (tabs)/ # 로그인 후 하단 탭 그룹
│ ├── \_layout.tsx # 탭 설정 (커스텀 TabBar 적용)
│ ├── home.tsx # 홈 탭
│ ├── chat.tsx # 채팅 탭
│ ├── ai-reviewer.tsx # 서류 검토 탭
│ └── mypage.tsx # 마이페이지 탭
│
├── components/ # 앱 전역에서 재사용하는 로직이 없는 순수 UI 컴포넌트
│ ├── TabBar.tsx # 하단 탭바 (Figma 스펙 커스텀 디자인)
│ └── PlaceholderScreen.tsx # 미구현 화면 임시 표시용
│
├── features/ # 도메인(기능)별로 코드를 격리하여 관리하는 공간
│ ├── ai-reviewer/ # [AI 서류 검토] 도메인 폴더
│ │ ├── components/ # 이 기능의 화면을 구성하는 전용 컴포넌트
│ │ ├── hooks/ # 이 기능에 종속된 비즈니스 로직 및 상태 제어 커스텀 훅
│ │ └── services/ # 이 기능에서 사용하는 API 호출 및 외부 연동 함수
│ │
│ ├── matching/ # [1:1 매칭] 도메인 폴더 (하단 탭에서는 빠짐, 추후 스택 라우트로 진입 예정)
│ │ ├── components/ # 이 기능의 화면을 구성하는 전용 컴포넌트
│ │ ├── hooks/ # 이 기능에 종속된 비즈니스 로직 및 상태 제어 커스텀 훅
│ │ └── store/ # 이 기능 내부에서만 공유하는 독립 전역 상태 (Zustand 등)
│ │
│ ├── housing-report/ # [집 입주 상태 리포트] 도메인 폴더 (하단 탭에서는 빠짐, 추후 스택 라우트로 진입 예정)
│ │ ├── components/ # 이 기능의 화면을 구성하는 전용 컴포넌트
│ │ ├── hooks/ # 이 기능에 종속된 비즈니스 로직 및 상태 제어 커스텀 훅
│ │ ├── services/ # 이 기능에서 사용하는 API 호출 및 외부 연동 함수
│ │ └── store/ # 이 기능 내부에서만 공유하는 독립 전역 상태 (Zustand 등)
│ │
│ ├── home/ # [홈] 도메인 폴더
│ │ └── components/ # 홈 화면 전용 컴포넌트 (HomeHeader 등)
│ │
│ └── auth/ # [인증] 도메인 폴더
│ ├── components/ # KakaoLoginButton, NonMemberButton, LoginTitle, AndroidKeyHashDebug(디버그용)
│ ├── hooks/ # useKakaoLogin - 로그인 흐름 및 토큰 저장 트리거
│ ├── services/ # authApi - 카카오 토큰 → 백엔드 JWT 교환
│ └── lib/ # keyHash - 카카오 콘솔 등록용 디버그 키해시 조회
│
├── lib/ # 앱 전역 인프라 (도메인에 속하지 않는 공용 클라이언트)
│ ├── api.ts # axios 공용 인스턴스 - 요청 시 JWT 자동 첨부, 401 시 자동 재발급(/api/tokens/reissue) 후 재시도
│ └── tokenStorage.ts # expo-secure-store 기반 JWT 저장/조회/삭제
│
├── store/ # 테마, 글로벌 토스트 등 앱 전역에서 참조하는 상태 관리
└── types/ # 프로젝트 전역에서 공유하는 데이터 모델 및 타입 정의
    └── api.ts # 백엔드 에러 응답 봉투 타입 (ApiEnvelope)

plugins/ # Expo config plugin (prebuild 시 네이티브 코드 자동 주입, android/ios는 커밋 안 함)
└── with-android-keyhash-module.js # 카카오 로그인 KeyHash 확인용 네이티브 모듈 주입

## 라우팅 규칙

- `src/app/`의 라우트 파일이 화면(Screen) 역할을 한다. 별도의 screens/, navigation/ 폴더는 두지 않는다.
- 라우트 파일은 얇게 유지한다: 화면 UI와 로직은 `features/<도메인>/`의 components/hooks를 조합해서 구성하고, 라우트 파일은 이를 배치하는 역할만 한다.
- 화면 이동 구조(스택, 탭 등)는 각 폴더의 `_layout.tsx`에서 설정한다.

# 로그인 방식

프론트: login() → 카카오 accessToken을 즉시 획득 → accessToken을 백엔드로 전송
백엔드: 받은 accessToken으로 카카오 사용자 정보 API(kapi.kakao.com/v2/user/me) 호출
→ 토큰이 유효한지 + 누구인지 확인 → 우리 서비스 JWT 발급 (이후는 동일)

# 카카오 로그인 토큰 전송 방식

{
"kakaoAccessToken": "카카오가 발급한 액세스 토큰"
}

# 디자인 시스템
