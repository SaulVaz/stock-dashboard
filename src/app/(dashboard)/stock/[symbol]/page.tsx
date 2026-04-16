 "use client";
import { use } from "react";
import { StockProfile } from "@/components/stock/StockProfile";
import { StockStats } from "@/components/stock/StockStats";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { NewsCard } from "@/components/news/NewsCard";
import { useCompanyNews } from "@/hooks/useCompanyNews";
import { PredictionCard } from "@/components/prediction/PredictionCard";
import { ROICalculator } from "@/components/stock/ROICalculator";
import { useStockQuote } from "@/hooks/useStockQuote";

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

function StockNews({ symbol }: { symbol: string }) {
  const { data: news, isLoading } = useCompanyNews(symbol);

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-foreground">Latest news</h2>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : news && news.length > 0 ? (
        <div className="flex flex-col gap-3">
          {news.slice(0, 8).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No recent news available.
        </p>
      )}
    </div>
  );
}

export default function StockPage({ params }: StockPageProps) {
  const { symbol } = use(params);
  const upperSymbol = symbol.toUpperCase();
  const { data: quote } = useStockQuote(upperSymbol);

  return (
    <div className="flex flex-col gap-6">
      <StockProfile symbol={upperSymbol} />
      <ChartContainer symbol={upperSymbol} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockStats symbol={upperSymbol} />
        <StockNews symbol={upperSymbol} />
        <PredictionCard symbol={upperSymbol} />
        <ROICalculator symbol={upperSymbol} currentPrice={quote?.c ?? 0} />
      </div>
    </div>
  );
}