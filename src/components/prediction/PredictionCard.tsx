"use client";
import { useStockCandles } from "@/hooks/useStockCandles";
import { generatePrediction } from "@/lib/prediction";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  symbol: string;
}

const SIGNAL_CONFIG = {
  strong_buy: { label: "Strong buy", color: "text-green-500", bg: "bg-green-500/10 border-green-500/30" },
  buy: { label: "Buy", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  neutral: { label: "Neutral", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/30" },
  sell: { label: "Sell", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
  strong_sell: { label: "Strong sell", color: "text-red-500", bg: "bg-red-500/10 border-red-500/30" },
};

const TREND_CONFIG = {
  bullish: { label: "Bullish", color: "text-green-500" },
  bearish: { label: "Bearish", color: "text-red-500" },
  neutral: { label: "Neutral", color: "text-yellow-500" },
};

function IndicatorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground">{value}</span>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-8 text-right">
        {value.toFixed(0)}%
      </span>
    </div>
  );
}

export function PredictionCard({ symbol }: PredictionCardProps) {
  const { data: candles, isLoading } = useStockCandles(symbol, "D");

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-4" />
        <div className="h-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!candles) return null;

  const prediction = generatePrediction(symbol, candles);

  if (!prediction) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm text-muted-foreground">
          Not enough data to generate prediction.
        </p>
      </div>
    );
  }

  const signalConfig = SIGNAL_CONFIG[prediction.signal];

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          AI Prediction — {symbol}
        </h2>
        <span
          className={cn(
            "text-xs font-medium px-3 py-1 rounded-full border",
            signalConfig.bg,
            signalConfig.color
          )}
        >
          {signalConfig.label}
        </span>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-2 gap-4">
        {/* 1 month */}
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            1 month target
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatPrice(prediction.monthPrediction.targetPrice)}
          </p>
          <p className={cn(
            "text-sm font-medium",
            TREND_CONFIG[prediction.monthPrediction.trend].color
          )}>
            {prediction.monthPrediction.percentChange >= 0 ? "+" : ""}
            {prediction.monthPrediction.percentChange.toFixed(2)}% ·{" "}
            {TREND_CONFIG[prediction.monthPrediction.trend].label}
          </p>
          <div className="mt-1">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <ConfidenceBar value={prediction.monthPrediction.confidence} />
          </div>
        </div>

        {/* 1 year */}
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            1 year target
          </p>
          <p className="text-xl font-bold text-foreground">
            {formatPrice(prediction.yearPrediction.targetPrice)}
          </p>
          <p className={cn(
            "text-sm font-medium",
            TREND_CONFIG[prediction.yearPrediction.trend].color
          )}>
            {prediction.yearPrediction.percentChange >= 0 ? "+" : ""}
            {prediction.yearPrediction.percentChange.toFixed(2)}% ·{" "}
            {TREND_CONFIG[prediction.yearPrediction.trend].label}
          </p>
          <div className="mt-1">
            <p className="text-xs text-muted-foreground mb-1">Confidence</p>
            <ConfidenceBar value={prediction.yearPrediction.confidence} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-background border border-border rounded-lg p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {prediction.summary}
        </p>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-2 gap-x-6">
        <div>
          <IndicatorRow label="RSI (14)" value={prediction.indicators.rsi.toFixed(1)} />
          <IndicatorRow label="Momentum 30d" value={`${prediction.indicators.momentum30.toFixed(2)}%`} />
          <IndicatorRow label="Momentum 90d" value={`${prediction.indicators.momentum90.toFixed(2)}%`} />
          <IndicatorRow label="Volatility" value={`${prediction.indicators.volatility.toFixed(1)}%`} />
        </div>
        <div>
          <IndicatorRow label="MA20" value={formatPrice(prediction.indicators.ma20)} />
          <IndicatorRow label="MA50" value={formatPrice(prediction.indicators.ma50)} />
          <IndicatorRow label="MA200" value={formatPrice(prediction.indicators.ma200)} />
          <IndicatorRow label="Support" value={formatPrice(prediction.indicators.support)} />
          <IndicatorRow label="Resistance" value={formatPrice(prediction.indicators.resistance)} />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground border-t border-border pt-3">
        ⚠ This prediction is based on technical analysis only and does not constitute financial advice. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
