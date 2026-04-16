"use client";
import { useState } from "react";
import { PriceChart } from "./PriceChart";
import { IntervalSelector } from "./IntervalSelector";
import { useStockCandles } from "@/hooks/useStockCandles";
import { useUIStore } from "@/store/ui";
import { TimeInterval } from "@/types/stock";
import { AlertsBell } from "@/components/alerts/AlertsBell";
import { formatPrice, formatChange, formatPercent, isPositive } from "@/lib/utils";
import { useStockQuote } from "@/hooks/useStockQuote";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  symbol: string;
}

export function ChartContainer({ symbol }: ChartContainerProps) {
  const [chartType, setChartType] = useState<"area" | "candlestick">("area");
  const { selectedInterval, setSelectedInterval } = useUIStore();
  const [showMA, setShowMA] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [maPeriod, setMaPeriod] = useState(20);

  const { data: quote, isLoading: quoteLoading } = useStockQuote(symbol);
  const { data: candles, isLoading: candlesLoading } = useStockCandles(
    symbol,
    selectedInterval
  );

  const positive = quote ? isPositive(quote.dp) : true;

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{symbol}</h2>
          {quoteLoading ? (
            <p className="text-muted-foreground text-sm mt-1">Loading...</p>
          ) : quote ? (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(quote.c)}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  positive ? "text-green-500" : "text-red-500"
                )}
              >
                {formatChange(quote.d)} ({formatPercent(quote.dp)})
              </span>
            </div>
          ) : null}
        </div>

        {/* Chart controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Chart type toggle */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
            <button
              onClick={() => setChartType("area")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                chartType === "area"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("candlestick")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                chartType === "candlestick"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              Candles
            </button>
          </div>

          {/* MA toggle */}
          <button
            onClick={() => setShowMA(!showMA)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              showMA
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "text-muted-foreground border-border hover:text-foreground"
            )}
          >
            MA{maPeriod}
          </button>

          {/* MA period selector */}
          {showMA && (
            <select
              value={maPeriod}
              onChange={(e) => setMaPeriod(Number(e.target.value))}
              className="px-2 py-1 rounded-lg text-xs border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={7}>MA7</option>
              <option value={20}>MA20</option>
              <option value={50}>MA50</option>
              <option value={200}>MA200</option>
            </select>
          )}

          {/* Volume toggle */}
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              showVolume
                ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                : "text-muted-foreground border-border hover:text-foreground"
            )}
          >
            Volume
          </button>
          {/* Alerts */}
          <AlertsBell symbol={symbol} />
        </div>
      </div>

      {/* Interval selector */}
      <IntervalSelector
        selected={selectedInterval}
        onChange={setSelectedInterval}
      />

      {/* Chart */}
      {candlesLoading ? (
        <div className="w-full h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading chart...</p>
        </div>
      ) : candles ? (
        <PriceChart
          data={candles}
          type={chartType}
          showMA={showMA}
          showVolume={showVolume}
          maPeriod={maPeriod}
        />
      ) : (
        <div className="w-full h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </div>
      )}

      {/* Stats row */}
      {quote && (
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="text-sm font-medium text-foreground mt-1">
              {formatPrice(quote.o)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">High</p>
            <p className="text-sm font-medium text-green-500 mt-1">
              {formatPrice(quote.h)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="text-sm font-medium text-red-500 mt-1">
              {formatPrice(quote.l)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prev. Close</p>
            <p className="text-sm font-medium text-foreground mt-1">
              {formatPrice(quote.pc)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}