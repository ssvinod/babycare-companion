import { create } from "zustand";

interface AppState {
  childName: string;
  setChildName(name: string): void;
}

export const useAppStore = create<AppState>((set) => ({
  childName: "",
  setChildName: (name) =>
    set({
      childName: name,
    }),
}));