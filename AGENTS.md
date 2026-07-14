# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Project Notes

## Stack

- Expo SDK 54, React Native 0.81, Expo Router 6, React 19.
- Styling uses NativeWind plus Figma design tokens in `tailwind.config.js`.
- Pretendard uses static font files (`Pretendard-Regular`, `Pretendard-Medium`, `Pretendard-SemiBold`, `Pretendard-Bold`) because Android does not reliably honor weights from the variable font. Prefer the configured font families/classes already used in the codebase.
- Shared app providers live in `src/app/_layout.tsx`: `SafeAreaProvider`, React Query `QueryClientProvider`, dark Expo status bar, and headerless Expo Router stack.
- `src/app/index.tsx` is the auth gate. It checks secure token storage and redirects to `/home` or `/login`.

## API And Auth

- `src/lib/api.ts` exports the shared axios instance.
- `EXPO_PUBLIC_API_URL` is required for API calls. Keep using static `process.env.EXPO_PUBLIC_API_URL` access.
- The axios instance automatically attaches the saved access token and retries one time after a 401 by calling `/api/tokens/reissue`.
- Document analysis/issuance APIs in `src/features/ai-reviewer/services/documentApi.ts` are stubs. Do not assume final backend paths or response shapes; replace only from real backend specs.

## AI Reviewer Flow

- Main checklist screen: `src/app/(tabs)/ai-reviewer.tsx`.
- Checklist data: `src/features/ai-reviewer/constants.ts`.
- Checklist component: `src/features/ai-reviewer/components/checklist/DocumentChecklist.tsx`.
- Registered house state is in `useRegisteredHouseStore`; document completion state is in `useDocumentProgressStore`.
- Step activation:
  - Contract-before items activate when a house address exists.
  - Contract-during items activate after both `register` and `building` are marked complete.
- Current checklist item routes:
  - `register` -> `/ai-reviewer/before/register-document?documentType=registry`
  - `building` -> `/ai-reviewer/before/register-document?documentType=building`
  - `brokerage` -> `/ai-reviewer/during/brokerage-info`
  - `lease-contract` -> `/ai-reviewer/during/lease-contract-info`

## Document Issuance And Analysis

- `register-document.tsx` is shared by registry and building documents via `documentType`.
- Both app issuance and scanner upload route to `/ai-reviewer/analyzing` with `documentType`; scanner also passes `imageUri`.
- `analyzing.tsx` uses a temporary 2-second timer until real API polling exists.
- Result routing from analyzing:
  - `registry` and `building` -> `/ai-reviewer/document-result`
  - `brokerage` -> `/ai-reviewer/during/brokerage-result`
  - `lease-contract` currently has no result screen, so analyzing does not auto-route for it.

## Registry And Building Result Screen

- Shared result screen: `src/app/ai-reviewer/document-result.tsx`.
- The screen is still mostly Figma/mock data. Backend integration should map API fields into the existing `positive`/`negative` status structures rather than rewriting the layout from scratch.
- Registry uses tabs: `기본 정보`, `위험 요소`, `근저당`.
- Building uses tabs: `기본 정보`, `위험 요소`.
- Reaching `document-result` marks `register` or `building` complete through `useDocumentProgressStore`.
- `InfoBanner` supports `variant: "positive" | "negative"` and always tints its icon:
  - positive: `#2C74F2`
  - negative: `#CB3D50`
- Building basic-info comparison currently uses `aiIcon` in `InfoBanner`, not `infoCardIcon`.
- Building risk tab has `buildingViolation.status`:
  - positive: check icon, `위반건축물이 아니에요`, no AI checklist card.
  - negative: caution icon, `위반건축물로 등록되어 있어요`, plus an AI checklist card.
- Registry risk tab has a positive no-risk state and a negative risk-card/checklist state.
- Registry loan-risk tab is rendered only for registry, not building.

## Contract-During Flow

- `brokerage-info.tsx` explains 중개대상물 확인 설명서 analysis and opens the document scanner.
- Successful brokerage scan routes to `/ai-reviewer/analyzing?documentType=brokerage&imageUri=...`.
- `brokerage-result.tsx` shows the scanned image behind a sliding bottom sheet and steps through four mocked analysis sections. Each section has `positive` and `negative` variants.
- `lease-contract-info.tsx` explains 임대차 계약서 analysis and opens the scanner, but the lease-contract result screen is not implemented yet.

## Layout And Components

- Common screen padding lives in `src/lib/layout.ts` as `SCREEN_PADDING`.
- Common UI includes `TopBar`, `Tab1`, `BottomSheet`, chips, badges, popups, and placeholder screens under `src/components`.
- `Tab1` is the segmented control used by result tabs. It supports color overrides for Figma variants.
- `ChecklistCard` supports optional `titleIcon` and `compact` mode for the building risk AI checklist.

## Working Guidelines

- Before Expo-related code changes, read the exact Expo v54 docs linked above.
- Prefer existing Figma token colors, typography helpers, and component patterns.
- Keep mock status objects (`positive`/`negative`) easy to replace with backend data.
- Be careful with image `tintColor`: only use it when the intended icon asset works as a tintable mask or the design explicitly needs recoloring.
- Use `npx tsc --noEmit` as the first verification pass after TypeScript changes.
