"use client";
import { useState } from "react";
import { useWatchlistStore } from "@/store/watchlist";
import { WatchlistCard } from "./WatchlistCard";
import { AddSymbolModal } from "./AddSymbolModal";

export function WatchlistGrid() {
  const { items } = useWatchlistStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Watchlist</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {items.length} symbol{items.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + Add symbol
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground text-sm">
            No symbols in your watchlist yet.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 text-primary text-sm hover:underline"
          >
            Add your first symbol
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <WatchlistCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
            />
          ))}
        </div>
      )}

      {showModal && <AddSymbolModal onClose={() => setShowModal(false)} />}
    </div>
  );
}