"use client";
import { useStockQuote } from "@/hooks/useStockQuote";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import {
  formatPrice,
  formatChange,
  formatPercent,
  formatMarketCap,
  isPositive,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

function SymbolColumn({ symbol, color }: { symbol: string; color: string }) {
  const { data: quote } = useStockQuote(symbol);
  const { data: profile } = useCompanyProfile(symbol);
  const positive = quote ? isPositive(quote.dp) : true;

  return (
    <td className="px-4 py-3 text-center">
      {quote ? (
        <span className="text-sm font-medium text-foreground">
          {formatPrice(quote.c)}
        </span>
      ) : (
        <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
      )}
    </td>
  );
}

function Row({
  label,
  symbols,
  getValue,
}: {
  label: string;
  symbols: string[];
  getValue: (symbol: string) => React.ReactNode;
}) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-sm text-muted-foreground font-medium">
        {label}
      </td>
      {symbols.map((symbol) => (
        <td key={symbol} className="px-4 py-3 text-center text-sm text-foreground">
          {getValue(symbol)}
        </td>
      ))}
    </tr>
  );
}

function SymbolData({
  symbol,
  field,
}: {
  symbol: string;
  field: string;
}) {
  const { data: quote } = useStockQuote(symbol);
  const { data: profile } = useCompanyProfile(symbol);

  if (field === "price") {
    return quote ? (
      <span>{formatPrice(quote.c)}</span>
    ) : (
      <div className="h-4 w-16 bg-muted animate-pulse rounded mx-auto" />
    );
  }
  if (field === "change") {
    const positive = quote ? isPositive(quote.dp) : true;
    return quote ? (
      <span className={positive ? "text-green-500" : "text-red-500"}>
        {formatChange(quote.d)} ({formatPercent(quote.dp)})
      </span>
    ) : null;
  }
  if (field === "high") return quote ? <span className="text-green-500">{formatPrice(quote.h)}</span> : null;
  if (field === "low") return quote ? <span className="text-red-500">{formatPrice(quote.l)}</span> : null;
  if (field === "open") return quote ? <span>{formatPrice(quote.o)}</span> : null;
  if (field === "prevClose") return quote ? <span>{formatPrice(quote.pc)}</span> : null;
  if (field === "marketCap") return profile ? <span>{formatMarketCap(profile.marketCapitalization)}</span> : null;
  if (field === "industry") return profile ? <span className="text-xs">{profile.finnhubIndustry}</span> : null;
  if (field === "exchange") return profile ? <span>{profile.exchange}</span> : null;

  return null;
}

interface CompareTableProps {
  symbols: string[];
}

export function CompareTable({ symbols }: CompareTableProps) {
  const fields = [
    { label: "Price", field: "price" },
    { label: "Change", field: "change" },
    { label: "High", field: "high" },
    { label: "Low", field: "low" },
    { label: "Open", field: "open" },
    { label: "Prev. close", field: "prevClose" },
    { label: "Market cap", field: "marketCap" },
    { label: "Industry", field: "industry" },
    { label: "Exchange", field: "exchange" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
              Metric
            </th>
            {symbols.map((symbol, i) => (
              <th
                key={symbol}
                className="px-4 py-3 text-center text-sm font-semibold"
                style={{ color: COLORS[i] }}
              >
                {symbol}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map(({ label, field }) => (
            <tr key={field} className="border-b border-border last:border-0">
              <td className="px-4 py-3 text-sm text-muted-foreground font-medium">
                {label}
              </td>
              {symbols.map((symbol) => (
                <td key={symbol} className="px-4 py-3 text-center">
                  <SymbolData symbol={symbol} field={field} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
