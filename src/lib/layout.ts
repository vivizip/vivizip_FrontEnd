/**
 * 화면 스크롤 영역(ScrollView contentContainerStyle) 공통 여백.
 * 대부분의 화면이 이 값을 그대로 쓰고, 플로팅 탭바 회피/고정 하단 버튼 등
 * 화면 고유 사정이 있으면 해당 화면에서 직접 override한다.
 */
export const SCREEN_PADDING = {
  horizontal: 16,
  top: 16,
  bottom: 40,
} as const;

/**
 * TopBar 상단 여백. Figma 스펙(padding 12px 16px, 상하 대칭)에서 위쪽에만 추가로 얹는 값.
 */
export const TOPBAR_EXTRA_TOP = 16;
