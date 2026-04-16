"use client";
import { useState } from "react";
import { useCompanyNews } from "@/hooks/useCompanyNews";
import { useWatchlistStore } from "@/store/watchlist";
import { NewsCard } from "./NewsCard";
import { cn } from "@/lib/utils";

export function NewsFeed() {
  const { items } = useWatchlistStore();
  const [activeSymbol, setActiveSymbol] = useState<string | undefined>(
    undefined
  );

  const { data: news, isLoading } = useCompanyNews(activeSymbol);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">News</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Latest financial news
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1 w-fit flex-wrap">
        <button
          onClick={() => setActiveSymbol(undefined)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            activeSymbol === undefined
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          Market news
        </button>
        {items.map((item) => (
          <button
            key={item.symbol}
            onClick={() => setActiveSymbol(item.symbol)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              activeSymbol === item.symbol
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {item.symbol}
          </button>
        ))}
      </div>

      {/* News list */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-4 h-24 animate-pulse"
            />
          ))}
        </div>
      ) : news && news.length > 0 ? (
        <div className="flex flex-col gap-3">
          {news.slice(0, 20).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground text-sm">
            No news available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}