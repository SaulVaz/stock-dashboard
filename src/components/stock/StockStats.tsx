"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { formatPrice, formatMarketCap } from "@/lib/utils";

interface StockStatsProps {
  symbol: string;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function StockStats({ symbol }: StockStatsProps) {
  const { data: quote } = useStockQuote(symbol);
  const { data: profile } = useCompanyProfile(symbol);

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-1">
      <h2 className="text-base font-semibold text-foreground mb-2">
        Stock stats
      </h2>

      {quote && (
        <>
          <StatRow label="Open" value={formatPrice(quote.o)} />
          <StatRow label="High" value={formatPrice(quote.h)} />
          <StatRow label="Low" value={formatPrice(quote.l)} />
          <StatRow label="Prev. close" value={formatPrice(quote.pc)} />
        </>
      )}

      {profile && (
        <>
          <StatRow
            label="Market cap"
            value={formatMarketCap(profile.marketCapitalization)}
          />
          <StatRow
            label="Shares outstanding"
            value={`${profile.shareOutstanding.toFixed(2)}M`}
          />
          <StatRow label="Exchange" value={profile.exchange} />
          <StatRow label="Currency" value={profile.currency} />
          <StatRow label="Country" value={profile.country} />
          <StatRow label="Industry" value={profile.finnhubIndustry} />
          <StatRow
            label="IPO date"
            value={profile.ipo}
          />
        </>
      )}
    </div>
  );
}
