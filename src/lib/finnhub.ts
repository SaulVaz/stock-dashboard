import { StockQuote, StockCandle, CompanyProfile } from "@/types/stock";
import { NewsItem } from "@/types/news";

const BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY;

async function fetchFinnhub<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append("token", API_KEY!);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const res = await fetch(url.toString(), { next: { revalidate: 30 } });

  if (!res.ok) {
    throw new Error(`Finnhub API error: ${res.status}`);
  }

  return res.json();
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  return fetchFinnhub<StockQuote>("/quote", { symbol });
}

export async function getStockCandles(
  symbol: string,
  resolution: string = "D",
  from: number,
  to: number
): Promise<StockCandle> {
  return fetchFinnhub<StockCandle>("/stock/candle", {
    symbol,
    resolution,
    from: from.toString(),
    to: to.toString(),
  });
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  return fetchFinnhub<CompanyProfile>("/stock/profile2", { symbol });
}

export async function getCompanyNews(
  symbol: string,
  from: string,
  to: string
): Promise<NewsItem[]> {
  return fetchFinnhub<NewsItem[]>("/company-news", { symbol, from, to });
}

export async function getMarketNews(): Promise<NewsItem[]> {
  return fetchFinnhub<NewsItem[]>("/news", { category: "general" });
}

export async function searchSymbol(query: string) {
  return fetchFinnhub<{ count: number; result: { description: string; displaySymbol: string; symbol: string; type: string }[] }>(
    "/search",
    { q: query }
  );
}

export async function getStockCandlesAlt(
  symbol: string,
  resolution: string = "D"
): Promise<StockCandle> {
  const rangeMap: Record<string, { interval: string; range: string }> = {
    "1":  { interval: "1m",  range: "1d" },
    "5":  { interval: "5m",  range: "5d" },
    "15": { interval: "15m", range: "5d" },
    "30": { interval: "30m", range: "1mo" },
    "60": { interval: "60m", range: "1mo" },
    "D":  { interval: "1d",  range: "1y" },
    "W":  { interval: "1wk", range: "2y" },
    "M":  { interval: "1mo", range: "5y" },
  };

  const { interval, range } = rangeMap[resolution] ?? rangeMap["D"];

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch candles");

  const json = await res.json();
  const result = json.chart.result[0];
  const timestamps = result.timestamp as number[];
  const quotes = result.indicators.quote[0];

  return {
    t: timestamps,
    o: quotes.open,
    h: quotes.high,
    l: quotes.low,
    c: quotes.close,
    v: quotes.volume,
    s: "ok",
  };
}

export async function getMarketMovers(): Promise<{
  gainers: { symbol: string; change: number; percentChange: number; currentPrice: number }[];
  losers: { symbol: string; change: number; percentChange: number; currentPrice: number }[];
}> {
  const res = await fetchFinnhub<{
    gainers: { symbol: string; change: number; percentChange: number; currentPrice: number }[];
    losers: { symbol: string; change: number; percentChange: number; currentPrice: number }[];
  }>("/stock/market-status", {});
  return res;
}

export async function getMultipleQuotes(
  symbols: string[]
): Promise<Record<string, StockQuote>> {
  const promises = symbols.map(async (symbol) => {
    try {
      const quote = await getStockQuote(symbol);
      return { symbol, quote };
    } catch {
      return { symbol, quote: null };
    }
  });

  const results = await Promise.all(promises);
  const map: Record<string, StockQuote> = {};
  results.forEach(({ symbol, quote }) => {
    if (quote) map[symbol] = quote;
  });
  return map;
}