"use client";
import { useState } from "react";
import { useWatchlistStore } from "@/store/watchlist";
import { searchSymbol } from "@/lib/finnhub";

interface AddSymbolModalProps {
  onClose: () => void;
}

export function AddSymbolModal({ onClose }: AddSymbolModalProps) {
  const { addSymbol, hasSymbol } = useWatchlistStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([]);
  const [searching, setSearching] = useState(false);

    async function handleSearch(value: string) {
    setQuery(value);
    if (value.length < 1) {
        setResults([]);
        return;
    }
    setSearching(true);
    try {
        const res = await fetch(`/api/stock/search?q=${value}`);
        const data = await res.json();
        setResults(data.result.slice(0, 8));
    } catch {
        setResults([]);
    } finally {
        setSearching(false);
    }
    }

  function handleAdd(symbol: string, description: string) {
    addSymbol(symbol, description);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Add symbol
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search symbol... (AAPL, TSLA)"
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="mt-3 flex flex-col gap-1 max-h-64 overflow-y-auto">
          {searching && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Searching...
            </p>
          )}
          {!searching && results.map((r) => {
            const already = hasSymbol(r.symbol);
            return (
              <button
                key={r.symbol}
                onClick={() => !already && handleAdd(r.symbol, r.description)}
                disabled={already}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">{r.symbol}</span>
                  <span className="text-xs text-muted-foreground">{r.description}</span>
                </div>
                {already ? (
                  <span className="text-xs text-muted-foreground">Added</span>
                ) : (
                  <span className="text-xs text-primary">+ Add</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
