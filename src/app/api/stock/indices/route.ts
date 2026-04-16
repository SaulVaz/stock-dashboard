import { NextResponse } from "next/server";
import { getStockQuote } from "@/lib/finnhub";

const INDICES = [
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "QQQ", name: "Nasdaq 100" },
  { symbol: "DIA", name: "Dow Jones" },
  { symbol: "IWM", name: "Russell 2000" },
];

export async function GET() {
  try {
    const results = await Promise.all(
      INDICES.map(async (index) => {
        const quote = await getStockQuote(index.symbol);
        return {
          symbol: index.symbol,
          name: index.name,
          price: quote.c,
          change: quote.d,
          percentChange: quote.dp,
        };
      })
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch indices" },
      { status: 500 }
    );
  }
}
