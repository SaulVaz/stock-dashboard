import { useQuery } from "@tanstack/react-query";
import { getDateRange } from "@/lib/utils";
import { TimeInterval } from "@/types/stock";

const INTERVAL_DAYS: Record<TimeInterval, number> = {
  "1": 1,
  "5": 5,
  "15": 7,
  "30": 14,
  "60": 30,
  "D": 365,
  "W": 730,
  "M": 1825,
};

async function fetchCandles(symbol: string, interval: TimeInterval) {
  const { from, to } = getDateRange(INTERVAL_DAYS[interval]);
  const res = await fetch(
    `/api/stock/candles/${symbol}?resolution=${interval}&from=${from}&to=${to}`
  );
  if (!res.ok) throw new Error("Failed to fetch candles");
  return res.json();
}

export function useStockCandles(symbol: string, interval: TimeInterval = "D") {
  return useQuery({
    queryKey: ["candles", symbol, interval],
    queryFn: () => fetchCandles(symbol, interval),
    enabled: !!symbol,
    staleTime: 60 * 1000,
  });
}