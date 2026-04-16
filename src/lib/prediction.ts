import { StockCandle } from "@/types/stock";

export interface PredictionResult {
  symbol: string;
  currentPrice: number;
  monthPrediction: {
    targetPrice: number;
    percentChange: number;
    trend: "bullish" | "bearish" | "neutral";
    confidence: number;
  };
  yearPrediction: {
    targetPrice: number;
    percentChange: number;
    trend: "bullish" | "bearish" | "neutral";
    confidence: number;
  };
  indicators: {
    rsi: number;
    momentum30: number;
    momentum90: number;
    volatility: number;
    support: number;
    resistance: number;
    ma20: number;
    ma50: number;
    ma200: number;
  };
  signal: "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell";
  summary: string;
}

function calculateMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1];
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;

  const changes = prices.slice(-period - 1).map((p, i, arr) => {
    if (i === 0) return 0;
    return p - arr[i - 1];
  }).slice(1);

  const gains = changes.filter((c) => c > 0);
  const losses = changes.filter((c) => c < 0).map((c) => Math.abs(c));

  const avgGain = gains.length > 0
    ? gains.reduce((a, b) => a + b, 0) / period
    : 0;
  const avgLoss = losses.length > 0
    ? losses.reduce((a, b) => a + b, 0) / period
    : 0;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  const returns = prices.slice(-30).map((p, i, arr) => {
    if (i === 0) return 0;
    return (p - arr[i - 1]) / arr[i - 1];
  }).slice(1);

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

function calculateSupport(prices: number[], period: number = 30): number {
  return Math.min(...prices.slice(-period));
}

function calculateResistance(prices: number[], period: number = 30): number {
  return Math.max(...prices.slice(-period));
}

function calculateMomentum(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const current = prices[prices.length - 1];
  const past = prices[prices.length - period];
  return ((current - past) / past) * 100;
}

function getTrend(percentChange: number): "bullish" | "bearish" | "neutral" {
  if (percentChange > 2) return "bullish";
  if (percentChange < -2) return "bearish";
  return "neutral";
}

function getSignal(
  rsi: number,
  momentum30: number,
  momentum90: number,
  currentPrice: number,
  ma20: number,
  ma50: number,
  ma200: number
): "strong_buy" | "buy" | "neutral" | "sell" | "strong_sell" {
  let score = 0;

  // RSI signals
  if (rsi < 30) score += 2;
  else if (rsi < 45) score += 1;
  else if (rsi > 70) score -= 2;
  else if (rsi > 55) score -= 1;

  // Momentum signals
  if (momentum30 > 5) score += 2;
  else if (momentum30 > 2) score += 1;
  else if (momentum30 < -5) score -= 2;
  else if (momentum30 < -2) score -= 1;

  if (momentum90 > 10) score += 1;
  else if (momentum90 < -10) score -= 1;

  // MA signals
  if (currentPrice > ma20) score += 1;
  else score -= 1;

  if (currentPrice > ma50) score += 1;
  else score -= 1;

  if (currentPrice > ma200) score += 1;
  else score -= 1;

  if (score >= 5) return "strong_buy";
  if (score >= 2) return "buy";
  if (score <= -5) return "strong_sell";
  if (score <= -2) return "sell";
  return "neutral";
}

function generateSummary(
  signal: string,
  rsi: number,
  momentum30: number,
  volatility: number,
  currentPrice: number,
  ma200: number
): string {
  const parts: string[] = [];

  if (signal === "strong_buy") parts.push("Strong bullish signal across multiple indicators.");
  else if (signal === "buy") parts.push("Moderate bullish signal with positive momentum.");
  else if (signal === "strong_sell") parts.push("Strong bearish signal across multiple indicators.");
  else if (signal === "sell") parts.push("Moderate bearish signal with negative momentum.");
  else parts.push("Mixed signals suggest a neutral outlook.");

  if (rsi < 30) parts.push("RSI indicates oversold conditions — potential reversal.");
  else if (rsi > 70) parts.push("RSI indicates overbought conditions — caution advised.");
  else parts.push(`RSI at ${rsi.toFixed(1)} is in neutral territory.`);

  if (momentum30 > 0) parts.push(`30-day momentum is positive at +${momentum30.toFixed(1)}%.`);
  else parts.push(`30-day momentum is negative at ${momentum30.toFixed(1)}%.`);

  if (currentPrice > ma200) parts.push("Price is trading above the 200-day MA — long-term uptrend intact.");
  else parts.push("Price is trading below the 200-day MA — long-term downtrend.");

  parts.push(`Annualized volatility is ${volatility.toFixed(1)}% — ${volatility > 40 ? "high risk" : volatility > 20 ? "moderate risk" : "low risk"}.`);

  return parts.join(" ");
}

export function generatePrediction(
  symbol: string,
  candles: StockCandle
): PredictionResult | null {
  if (!candles?.c || candles.c.length < 50) return null;

  const prices = candles.c;
  const currentPrice = prices[prices.length - 1];

  const ma20 = calculateMA(prices, 20);
  const ma50 = calculateMA(prices, 50);
  const ma200 = calculateMA(prices, Math.min(200, prices.length));
  const rsi = calculateRSI(prices);
  const volatility = calculateVolatility(prices);
  const momentum30 = calculateMomentum(prices, Math.min(30, prices.length - 1));
  const momentum90 = calculateMomentum(prices, Math.min(90, prices.length - 1));
  const support = calculateSupport(prices);
  const resistance = calculateResistance(prices);

  const signal = getSignal(rsi, momentum30, momentum90, currentPrice, ma20, ma50, ma200);

  // Month prediction
  const monthGrowthRate = momentum30 / 30;
  const rsiAdjustment = rsi > 70 ? -0.1 : rsi < 30 ? 0.1 : 0;
  const monthChange = (monthGrowthRate * 30 + rsiAdjustment) * 0.6;
  const monthTargetPrice = currentPrice * (1 + monthChange / 100);
  const monthConfidence = Math.max(
    30,
    Math.min(85, 60 - volatility * 0.5 + Math.abs(momentum30) * 0.5)
  );

  // Year prediction
  const yearGrowthRate = momentum90 / 90;
  const maAlignment = currentPrice > ma50 && ma50 > ma200 ? 1.2 : currentPrice < ma50 && ma50 < ma200 ? 0.8 : 1;
  const yearChange = yearGrowthRate * 365 * maAlignment * 0.4;
  const yearTargetPrice = currentPrice * (1 + yearChange / 100);
  const yearConfidence = Math.max(
    20,
    Math.min(75, 50 - volatility * 0.8 + Math.abs(momentum90) * 0.3)
  );

  const summary = generateSummary(signal, rsi, momentum30, volatility, currentPrice, ma200);

  return {
    symbol,
    currentPrice,
    monthPrediction: {
      targetPrice: monthTargetPrice,
      percentChange: monthChange,
      trend: getTrend(monthChange),
      confidence: monthConfidence,
    },
    yearPrediction: {
      targetPrice: yearTargetPrice,
      percentChange: yearChange,
      trend: getTrend(yearChange),
      confidence: yearConfidence,
    },
    indicators: {
      rsi,
      momentum30,
      momentum90,
      volatility,
      support,
      resistance,
      ma20,
      ma50,
      ma200,
    },
    signal,
    summary,
  };
}
