"use client";
import { useWatchlistStore } from "@/store/watchlist";
import { useStockQuote } from "@/hooks/useStockQuote";
import { Sparkline } from "@/components/watchlist/Sparkline";
import { formatPrice, formatPercent, formatChange, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

function WatchlistSummaryCard({ symbol, name }: { symbol: string; name: string }) {
  const router = useRouter();
  const { data: quote, isLoading } = useStockQuote(symbol);
  const positive = quote ? isPositive(quote.dp) : true;

  return (
    <div
      onClick={() => router.push(`/stock/${symbol}`)}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all flex flex-col gap-2"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{symbol}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[120px]">{name}</p>
        </div>
        {quote && (
          <span className={cn(
            "text-xs font-medium",
            positive ? "text-green-500" : "text-red-500"
          )}>
            {formatPercent(quote.dp)}
          </span>
        )}
      </div>

      <Sparkline symbol={symbol} positive={positive} />

      {isLoading ? (
        <div className="h-5 w-20 bg-muted animate-pulse rounded" />
      ) : quote ? (
        <div>
          <p className="text-base font-bold text-foreground">
            {formatPrice(quote.c)}
          </p>
          <p className={cn(
            "text-xs",
            positive ? "text-green-500" : "text-red-500"
          )}>
            {formatChange(quote.d)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function WatchlistSummary() {
  const { items } = useWatchlistStore();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Your watchlist</h2>
        <span className="text-xs text-muted-foreground">
          {items.length} symbol{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No symbols in your watchlist yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <WatchlistSummaryCard
              key={item.symbol}
              symbol={item.symbol}
              name={item.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}