import { create } from "zustand";
import { TimeInterval } from "@/types/stock";

interface UIStore {
  selectedSymbol: string;
  selectedInterval: TimeInterval;
  sidebarOpen: boolean;
  setSelectedSymbol: (symbol: string) => void;
  setSelectedInterval: (interval: TimeInterval) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  selectedSymbol: "AAPL",
  selectedInterval: "D",
  sidebarOpen: true,

  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setSelectedInterval: (interval) => set({ selectedInterval: interval }),
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));