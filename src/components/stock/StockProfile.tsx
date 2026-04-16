"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { useWatchlistStore } from "@/store/watchlist";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatMarketCap,
  isPositive,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StockProfileProps {
  symbol: string;
}

export function StockProfile({ symbol }: StockProfileProps) {
  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: profile, isLoading: profileLoading } = useCompanyProfile(symbol);
  const { addSymbol, removeSymbol, hasSymbol } = useWatchlistStore();

  const positive = quote ? isPositive(quote.dp) : true;
  const inWatchlist = hasSymbol(symbol);

  function handleWatchlist() {
    if (inWatchlist) {
      removeSymbol(symbol);
    } else {
      addSymbol(symbol, profile?.name ?? symbol);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        {/* Logo + name */}
        <div className="flex items-center gap-4">
          {profile?.logo && (
            <img
              src={profile.logo}
              alt={profile.name}
              className="w-12 h-12 rounded-xl object-contain bg-white p-1"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{symbol}</h1>
              {profile?.exchange && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {profile.exchange}
                </span>
              )}
            </div>
            {profileLoading ? (
              <div className="h-4 w-32 bg-muted animate-pulse rounded mt-1" />
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile?.name} · {profile?.finnhubIndustry}
              </p>
            )}
          </div>
        </div>

        {/* Watchlist button */}
        <button
          onClick={handleWatchlist}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0",
            inWatchlist
              ? "bg-primary/10 text-primary hover:bg-red-500/10 hover:text-red-500"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {inWatchlist ? "★ In watchlist" : "☆ Add to watchlist"}
        </button>
      </div>

      {/* Price */}
      <div className="mt-4">
        {quoteLoading ? (
          <div className="h-10 w-40 bg-muted animate-pulse rounded" />
        ) : quote ? (
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-foreground">
              {formatPrice(quote.c)}
            </span>
            <span
              className={cn(
                "text-lg font-medium mb-1",
                positive ? "text-green-500" : "text-red-500"
              )}
            >
              {formatChange(quote.d)} ({formatPercent(quote.dp)})
            </span>
            {profile?.currency && (
              <span className="text-sm text-muted-foreground mb-1">
                {profile.currency}
              </span>
            )}
          </div>
        ) : null}

        {profile && (
          <p className="text-sm text-muted-foreground mt-1">
            Market cap: {formatMarketCap(profile.marketCapitalization)}
          </p>
        )}
      </div>
    </div>
  );
}
