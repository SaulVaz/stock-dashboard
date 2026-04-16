import { NewsItem } from "@/types/news";
import { useQuery } from "@tanstack/react-query";

function getFormattedDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
}

async function fetchNews(symbol?: string) {
  if (symbol) {
    const from = getFormattedDate(7);
    const to = getFormattedDate(0);
    const res = await fetch(
      `/api/news/company/${symbol}?from=${from}&to=${to}`
    );
    if (!res.ok) throw new Error("Failed to fetch company news");
    return res.json();
  }

  const res = await fetch("/api/news/market");
  if (!res.ok) throw new Error("Failed to fetch market news");
  return res.json();
}

export function useCompanyNews(symbol?: string) {
  return useQuery<NewsItem[]>({
    queryKey: ["news", symbol ?? "market"],
    queryFn: () => fetchNews(symbol),
    staleTime: 5 * 60 * 1000,
  });
}