"use client";
import { MarketIndices } from "@/components/dashboard/MarketIndices";
import { WatchlistSummary } from "@/components/dashboard/WatchlistSummary";
import { TopMovers } from "@/components/movers/TopMovers";
import { RecentNews } from "@/components/dashboard/RecentNews";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Market Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time market data and insights
        </p>
      </div>

      {/* Indices */}
      <MarketIndices />

      {/* Watchlist summary */}
      <WatchlistSummary />

      {/* Movers + News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopMovers />
        <RecentNews />
      </div>
    </div>
  );
}