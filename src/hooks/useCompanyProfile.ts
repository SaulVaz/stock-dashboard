import { useQuery } from "@tanstack/react-query";

async function fetchProfile(symbol: string) {
  const res = await fetch(`/api/stock/profile/${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export function useCompanyProfile(symbol: string) {
  return useQuery({
    queryKey: ["profile", symbol],
    queryFn: () => fetchProfile(symbol),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000,
  });
}