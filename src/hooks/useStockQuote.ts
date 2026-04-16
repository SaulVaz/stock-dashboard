import { useQuery } from "@tanstack/react-query";

async function fetchQuote(symbol: string) {
  const res = await fetch(`/api/stock/quote/${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch quote");
  return res.json();
}

export function useStockQuote(symbol: string) {
  return useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => fetchQuote(symbol),
    enabled: !!symbol,
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,
  });
}