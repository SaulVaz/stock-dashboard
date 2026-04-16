"use client";
import { useQuery } from "@tanstack/react-query";
import { formatPrice, formatPercent, formatChange } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

interface Mover {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
}

interface MoversData {
  gainers: Mover[];
  losers: Mover[];
}

async function fetchMovers(): Promise<MoversData> {
  const res = await fetch("/api/stock/movers");
  if (!res.ok) throw new Error("Failed to fetch movers");
  return res.json();
}

function MoverRow({ mover, type }: { mover: Mover; type: "gainer" | "loser" }) {
  const router = useRouter();
  const { setSelectedSymbol } = useUIStore();

  function handleClick() {
    setSelectedSymbol(mover.symbol);
    router.push(`/stock/${mover.symbol}`);
  }

  const positive = type === "gainer";

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer hover:bg-accent/50 px-2 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-1.5 h-8 rounded-full",
            positive ? "bg-green-500" : "bg-red-500"
          )}
        />
        <div>
          <p className="text-sm font-semibold text-foreground">{mover.symbol}</p>
          <p className="text-xs text-muted-foreground">{formatPrice(mover.currentPrice)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "text-sm font-medium",
          positive ? "text-green-500" : "text-red-500"
        )}>
          {formatPercent(mover.percentChange)}
        </p>
        <p className={cn(
          "text-xs",
          positive ? "text-green-500/70" : "text-red-500/70"
        )}>
          {formatChange(mover.change)}
        </p>
      </div>
    </div>
  );
}

function MoversSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export function TopMovers() {
  const { data, isLoading } = useQuery({
    queryKey: ["movers"],
    queryFn: fetchMovers,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gainers */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-base font-semibold text-foreground">
            Top gainers
          </h2>
        </div>
        {isLoading ? (
          <MoversSkeleton />
        ) : data?.gainers && data.gainers.length > 0 ? (
          <div className="flex flex-col">
            {data.gainers.map((mover) => (
              <MoverRow key={mover.symbol} mover={mover} type="gainer" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </div>

      {/* Losers */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <h2 className="text-base font-semibold text-foreground">
            Top losers
          </h2>
        </div>
        {isLoading ? (
          <MoversSkeleton />
        ) : data?.losers && data.losers.length > 0 ? (
          <div className="flex flex-col">
            {data.losers.map((mover) => (
              <MoverRow key={mover.symbol} mover={mover} type="loser" />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
      </div>
    </div>
  );
}