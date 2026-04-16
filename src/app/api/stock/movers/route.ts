import { NextResponse } from "next/server";
import { getMultipleQuotes } from "@/lib/finnhub";

const TRACKED_SYMBOLS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "BRK.B",
  "JPM", "V", "UNH", "XOM", "JNJ", "WMT", "PG", "MA", "HD", "CVX",
  "MRK", "LLY", "ABBV", "PEP", "KO", "AVGO", "COST", "MCD", "TMO",
  "ACN", "DHR", "NEE", "AMD", "INTC", "QCOM", "TXN", "NFLX", "ADBE",
];

export async function GET() {
  try {
    const quotes = await getMultipleQuotes(TRACKED_SYMBOLS);

    const movers = Object.entries(quotes)
      .map(([symbol, quote]) => ({
        symbol,
        currentPrice: quote.c,
        change: quote.d,
        percentChange: quote.dp,
      }))
      .filter((m) => m.percentChange !== 0);

    const sorted = [...movers].sort((a, b) => b.percentChange - a.percentChange);

    const gainers = sorted.slice(0, 5);
    const losers = sorted.slice(-5).reverse();

    return NextResponse.json({ gainers, losers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movers" },
      { status: 500 }
    );
  }
}