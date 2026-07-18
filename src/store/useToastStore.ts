import { create } from "zustand";

type ToastState = {
  /** 현재 표시 중인 메시지. 없으면 null (Toast 컴포넌트가 미표시). */
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
};

/**
 * 앱 전역 토스트 상태. src/app/_layout.tsx의 Toast가 구독해서 어느 화면에서든
 * useToastStore.getState().show("메시지")로 띄울 수 있다.
 */
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  show: (message) => set({ message }),
  hide: () => set({ message: null }),
}));
