"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useWatchlistStore } from "@/store/watchlist";
import { useUIStore } from "@/store/ui";
import { formatPrice, formatChange, formatPercent, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Sparkline } from "./Sparkline";

interface WatchlistCardProps {
  symbol: string;
  name: string;
}

export function WatchlistCard({ symbol, name }: WatchlistCardProps) {
  const router = useRouter();
  const { removeSymbol } = useWatchlistStore();
  const { setSelectedSymbol } = useUIStore();
  const { data: quote, isLoading } = useStockQuote(symbol);

  const positive = quote ? isPositive(quote.dp) : true;

  function handleClick() {
    setSelectedSymbol(symbol);
    router.push("/dashboard");
  }

  return (
    <div
      onClick={handleClick}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all group flex flex-col gap-2"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{symbol}</span>
          <span className="text-xs text-muted-foreground truncate max-w-[140px]">
            {name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeSymbol(symbol);
          }}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all text-xs px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>

      {/* Sparkline */}
      <div onClick={(e) => e.stopPropagation()}>
        <Sparkline symbol={symbol} positive={positive} />
      </div>

      {/* Price */}
      <div>
        {isLoading ? (
          <div className="h-6 w-24 bg-muted animate-pulse rounded" />
        ) : quote ? (
          <>
            <p className="text-lg font-bold text-foreground">
              {formatPrice(quote.c)}
            </p>
            <p className={cn(
              "text-xs font-medium mt-0.5",
              positive ? "text-green-500" : "text-red-500"
            )}>
              {formatChange(quote.d)} ({formatPercent(quote.dp)})
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No data</p>
        )}
      </div>
    </div>
  );
}