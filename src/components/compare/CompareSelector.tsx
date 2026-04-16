"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

interface CompareSelectorProps {
  symbols: string[];
  onAdd: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}

export function CompareSelector({ symbols, onAdd, onRemove }: CompareSelectorProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);

  async function validateSymbol(symbol: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/stock/quote/${symbol}`);
      const data = await res.json();
      return res.ok && data.c && data.c > 0;
    } catch {
      return false;
    }
  }

  async function handleAdd() {
    const symbol = input.trim().toUpperCase();
    if (!symbol) return;

    if (symbols.includes(symbol)) {
      setError("Symbol already added");
      return;
    }

    if (symbols.length >= 4) {
      setError("Max 4 symbols allowed");
      return;
    }

    setValidating(true);
    setError("");

    const isValid = await validateSymbol(symbol);

    if (!isValid) {
      setError(`"${symbol}" is not a valid symbol`);
      setValidating(false);
      return;
    }

    onAdd(symbol);
    setInput("");
    setError("");
    setValidating(false);
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Select symbols to compare
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Add up to 4 symbols
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Type a symbol... (AAPL)"
          className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleAdd}
          disabled={symbols.length >= 4 || validating}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-w-[80px]"
        >
          {validating ? "..." : "+ Add"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {symbols.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {symbols.map((symbol, i) => (
            <div
              key={symbol}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
              style={{
                borderColor: COLORS[i],
                color: COLORS[i],
                backgroundColor: `${COLORS[i]}15`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              {symbol}
              <button
                onClick={() => onRemove(symbol)}
                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}