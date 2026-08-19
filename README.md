# VIVIZIP(비비집) — FrontEnd

![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-6-000000)

유학생/외국인 세입자가 한국에서 집을 구하고 계약하는 전 과정(집 등록 → 서류 검토 → 계약 → 입주)을 돕는 서비스, **VIVIZIP**의 프론트엔드 레포지토리입니다. Expo(React Native) + TypeScript로 개발되었고, 이 레포는 그중 **프론트엔드 전체 구현**을 담당한 결과물입니다.

## 목차

- [프로젝트 설명](#프로젝트-설명)
  - [기술 스택](#기술-스택)
  - [핵심 기능](#핵심-기능)
  - [연동](#연동)
  - [직면했던 문제들](#직면했던-문제들)
  - [향후 구현할 기능](#향후-구현할-기능)
- [사용법](#사용법)
  - [인증 정보](#인증-정보)
- [역할](#역할)

## 프로젝트 설명

VIVIZIP은 카카오 로그인으로 시작해, 하단 4개 탭(홈 / 채팅 / **AI 서류 검토** / 마이페이지)을 중심으로 동작합니다. 서비스의 핵심은 **AI 서류 검토** 탭으로, 사용자가 등록한 집을 기준으로 계약전 → 계약중 → 계약후 3단계 체크리스트를 세로 타임라인으로 보여주고, 각 단계별 서류(등기부등본, 건축물대장, 중개대상물 확인 설명서, 임대차 계약서)를 촬영/발급하면 분석 결과를 리포트 형태로 제공합니다. 그 외에도 이미 정착한 유학생 서포터즈와 매칭돼 실시간으로 대화하는 **부메랑 매칭(1:1 채팅)** 기능과, 입주 후 하자를 사진과 함께 기록하는 **입주 상태 기록** 기능이 있습니다.

### 기술 스택

- **프레임워크**: Expo SDK 54 / React Native 0.81 / Expo Router 6 (파일 기반 라우팅) / React 19
- **언어**: TypeScript
- **스타일**: NativeWind(Tailwind) + Figma 디자인 토큰
- **상태 관리**: Zustand(클라이언트 상태, 화면 간 공유) / React Query(서버 상태 Provider)
- **데이터 패칭**: Axios(공용 인스턴스, JWT 자동 첨부 + 401 자동 재발급)
- **실시간 통신**: 채팅 폴링(초기엔 STOMP WebSocket 시도)
- **빌드**: EAS Cloud, CNG(Continuous Native Generation)

### 핵심 기능

- 카카오 로그인 → 서비스 자체 JWT 발급/자동 재발급/로그아웃
- 집 등록(주소 검색·현재 위치·지도) 및 계약 단계 서버 연동(`contractStage`)
- AI 서류 검토: 서류 스캔/앱 발급 → 분석 → 위험요소/근저당 등 리포트, 집별로 진행상태·분석 결과 분리 저장
- 부메랑 매칭 온보딩(시간대·국적·언어·성별 등) → 매칭 신청/상태/결과/재매칭
- 매칭된 메이트와의 1:1 채팅(이미지 전송, 약속잡기, 매칭 취소)
- 입주 상태 기록 CRUD(사진 첨부 포함)
- 마이페이지(프로필, 대학교 메일 인증, 활동 시간대, 계정·알림 설정)

### 연동

| 구분                   | 내용                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| 카카오 로그인 SDK      | 카카오 accessToken 획득 → 백엔드로 전달해 서비스 JWT 교환                                                          |
| 카카오 Local API       | 주소 검색·현재 위치 좌표 변환(집 등록 화면)                                                                        |
| VIVIZIP 백엔드(Spring) | 인증/토큰 재발급, 서류 업로드+분석, 계약 단계, 채팅(REST+폴링), 매칭, 입주 기록, 마이페이지 등 대부분의 도메인 API |
| Firebase               | 푸시 알림                                                                                                          |

### 직면했던 문제들

- **집 전환 시 이전 집 데이터 노출**: 서류 진행상태(`completedItemIds`)와 분석 결과 캐시가 전역으로 하나만 있어서, 다른 집으로 전환해도 이전 집 체크리스트/분석 결과가 그대로 보이던 버그 → 스토어를 집(house)별로 분리해 해결.
- **STOMP WebSocket 연결 불안정**: 채팅 실시간 수신을 순수 WebSocket(SockJS 미사용) STOMP로 구현했으나 연결이 자주 끊겨, 폴링 방식으로 전환해 안정성을 확보.
- **주소 검색 결과 React key 중복**: 같은 건물에 여러 업체가 검색되면 주소(title)를 key로 쓰던 목록에서 중복 경고가 발생 → index를 함께 조합해 해결.

## 사용법

```bash
git clone <this-repo>
cd vivizip-FrontEnd
npm install

# .env.example을 복사해 .env 생성 후 EXPO_PUBLIC_API_URL 설정
cp .env.example .env

npx expo start
```

- 네이티브 모듈을 새로 설치하거나 `app.json`의 `plugins`를 바꾼 경우에만 `npx expo prebuild --clean` 후 `npx expo run:android` / `npx expo run:ios`가 필요합니다. 그 외 JS/TS/스타일 변경은 `npx expo start -c`(캐시 클리어)로 충분합니다.
- TypeScript 변경 후에는 `npx tsc --noEmit`으로 먼저 검증합니다.

### 인증 정보

`.env`에는 `EXPO_PUBLIC_API_URL`(백엔드 API 주소)만 설정하면 됩니다. `EXPO_PUBLIC_` 접두사가 붙은 값은 빌드 시 앱 번들에 평문으로 포함되므로 비밀값을 넣지 않습니다. 카카오 로그인 앱 키는 클라이언트에서 필요한 공개 키 성격이라 `app.json`에 직접 명시돼 있습니다.

## 역할

VIVIZIP은 팀 프로젝트이며, 그중 **프론트엔드(Expo/React Native) 전체 구현**을 담당했습니다.
디자인은 Figma로 별도 전달받아 구현하고, 백엔드는 Spring 기반으로 별도 진행되는 API 명세(swagger)에 맞춰 axios로 연동했습니다.
