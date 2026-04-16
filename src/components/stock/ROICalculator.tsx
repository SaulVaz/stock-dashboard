"use client";
import { useState } from "react";
import { useStockCandles } from "@/hooks/useStockCandles";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ROICalculatorProps {
  symbol: string;
  currentPrice: number;
}

function findClosestPrice(
  candles: { t: number[]; c: number[] },
  targetDate: Date
): { price: number; date: string } | null {
  if (!candles?.t || candles.t.length === 0) return null;

  const targetTime = targetDate.getTime() / 1000;
  let closestIndex = 0;
  let closestDiff = Math.abs(candles.t[0] - targetTime);

  for (let i = 1; i < candles.t.length; i++) {
    const diff = Math.abs(candles.t[i] - targetTime);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestIndex = i;
    }
  }

  return {
    price: candles.c[closestIndex],
    date: new Date(candles.t[closestIndex] * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export function ROICalculator({ symbol, currentPrice }: ROICalculatorProps) {
  const [investmentDate, setInvestmentDate] = useState("");
  const [shares, setShares] = useState("");
  const [result, setResult] = useState<{
    buyPrice: number;
    buyDate: string;
    shares: number;
    initialInvestment: number;
    currentValue: number;
    profitLoss: number;
    roiPercent: number;
  } | null>(null);

  const { data: candles } = useStockCandles(symbol, "D");

  const minDate = "2020-01-01";
  const maxDate = new Date().toISOString().split("T")[0];

  function calculate() {
    if (!investmentDate || !shares || !candles) return;

    const sharesNum = parseFloat(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) return;

    const targetDate = new Date(investmentDate);
    const closest = findClosestPrice(candles, targetDate);
    if (!closest) return;

    const initialInvestment = closest.price * sharesNum;
    const currentValue = currentPrice * sharesNum;
    const profitLoss = currentValue - initialInvestment;
    const roiPercent = ((currentValue - initialInvestment) / initialInvestment) * 100;

    setResult({
      buyPrice: closest.price,
      buyDate: closest.date,
      shares: sharesNum,
      initialInvestment,
      currentValue,
      profitLoss,
      roiPercent,
    });
  }

  const positive = result ? result.profitLoss >= 0 : true;

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-foreground">
        ROI calculator
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            Purchase date
          </label>
          <input
            type="date"
            value={investmentDate}
            onChange={(e) => {
              setInvestmentDate(e.target.value);
              setResult(null);
            }}
            min={minDate}
            max={maxDate}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            Number of shares
          </label>
          <input
            type="number"
            value={shares}
            onChange={(e) => {
              setShares(e.target.value);
              setResult(null);
            }}
            placeholder="10"
            min="0.01"
            step="0.01"
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={!investmentDate || !shares || !candles}
        className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Calculate ROI
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Main ROI */}
          <div
            className={cn(
              "rounded-xl p-5 flex flex-col gap-1 border",
              positive
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            )}
          >
            <p className="text-xs text-muted-foreground">Total return</p>
            <p
              className={cn(
                "text-3xl font-bold",
                positive ? "text-green-500" : "text-red-500"
              )}
            >
              {positive ? "+" : ""}
              {result.roiPercent.toFixed(2)}%
            </p>
            <p
              className={cn(
                "text-lg font-medium",
                positive ? "text-green-500" : "text-red-500"
              )}
            >
              {positive ? "+" : ""}
              {formatPrice(result.profitLoss)}
            </p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Purchase date</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {result.buyDate}
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Purchase price</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {formatPrice(result.buyPrice)}
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Initial investment</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {formatPrice(result.initialInvestment)}
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Current value</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {formatPrice(result.currentValue)}
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Shares</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {result.shares}
              </p>
            </div>
            <div className="bg-background border border-border rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Current price</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {formatPrice(currentPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Disclaimer */}
        <p className="text-xs text-muted-foreground border-t border-border pt-3">
        ⚠ This calculator uses historical closing prices as reference. Results are for informational purposes only and do not constitute financial advice.
        </p>
    </div>
  );
}
