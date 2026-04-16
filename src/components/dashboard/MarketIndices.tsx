"use client";
import { useQuery } from "@tanstack/react-query";
import { formatPrice, formatPercent, formatChange, isPositive } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
}

async function fetchIndices(): Promise<IndexData[]> {
  const res = await fetch("/api/stock/indices");
  if (!res.ok) throw new Error("Failed to fetch indices");
  return res.json();
}

export function MarketIndices() {
  const { data, isLoading } = useQuery({
    queryKey: ["indices"],
    queryFn: fetchIndices,
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {data?.map((index) => {
        const positive = isPositive(index.percentChange);
        return (
          <div
            key={index.symbol}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1"
          >
            <p className="text-xs text-muted-foreground">{index.name}</p>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(index.price)}
            </p>
            <p className={cn(
              "text-xs font-medium",
              positive ? "text-green-500" : "text-red-500"
            )}>
              {formatChange(index.change)} ({formatPercent(index.percentChange)})
            </p>
          </div>
        );
      })}
    </div>
  );
}
