"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui";
import { useTheme } from "next-themes";

export function Header() {
  const router = useRouter();
  const { toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ symbol: string; description: string }[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleSearch(value: string) {
    setQuery(value);
    if (value.length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/stock/search?q=${value}`);
      const data = await res.json();
      setResults(data.result.slice(0, 6));
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSelect(symbol: string) {
    setQuery("");
    setShowResults(false);
    router.push(`/stock/${symbol}`);
  }

  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4">
      <button
        onClick={toggleSidebar}
        className="text-muted-foreground hover:text-foreground transition-colors text-lg"
      >
        ☰
      </button>

      <div className="relative flex-1 max-w-sm">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search symbol... (AAPL, TSLA)"
          className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {searching && (
          <span className="absolute right-3 top-2 text-xs text-muted-foreground">
            ...
          </span>
        )}
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {results.map((r) => (
              <button
                key={r.symbol}
                onMouseDown={() => handleSelect(r.symbol)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span className="font-medium text-foreground">{r.symbol}</span>
                <span className="text-muted-foreground text-xs truncate ml-2">
                  {r.description}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {mounted && (
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg"
        >
          {theme === "dark" ? "○" : "●"}
        </button>
      )}
    </header>
  );
}