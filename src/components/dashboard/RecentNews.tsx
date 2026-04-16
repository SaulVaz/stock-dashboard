"use client";
import { useCompanyNews } from "@/hooks/useCompanyNews";
import { NewsCard } from "@/components/news/NewsCard";

export function RecentNews() {
  const { data: news, isLoading } = useCompanyNews();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-foreground">Market news</h2>
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-card border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : news && news.length > 0 ? (
        <div className="flex flex-col gap-3">
          {news.slice(0, 6).map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No news available.</p>
        </div>
      )}
    </div>
  );
}
