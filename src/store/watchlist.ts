import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WatchlistItem } from "@/types/stock";

interface WatchlistStore {
  items: WatchlistItem[];
  addSymbol: (symbol: string, name: string) => void;
  removeSymbol: (symbol: string) => void;
  hasSymbol: (symbol: string) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [
        { symbol: "AAPL", name: "Apple Inc.", addedAt: Date.now() },
        { symbol: "TSLA", name: "Tesla Inc.", addedAt: Date.now() },
        { symbol: "GOOGL", name: "Alphabet Inc.", addedAt: Date.now() },
        { symbol: "MSFT", name: "Microsoft Corp.", addedAt: Date.now() },
      ],

      addSymbol: (symbol, name) => {
        if (get().hasSymbol(symbol)) return;
        set((state) => ({
          items: [
            ...state.items,
            { symbol, name, addedAt: Date.now() },
          ],
        }));
      },

      removeSymbol: (symbol) => {
        set((state) => ({
          items: state.items.filter((item) => item.symbol !== symbol),
        }));
      },

      hasSymbol: (symbol) => {
        return get().items.some((item) => item.symbol === symbol);
      },

      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: "watchlist-storage",
    }
  )
);
