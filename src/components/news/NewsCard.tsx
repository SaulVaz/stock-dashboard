"use client";
import { NewsItem } from "@/types/news";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  news: NewsItem;
}

export function NewsCard({ news }: NewsCardProps) {
  function handleClick() {
    window.open(news.url, "_blank");
  }

  return (
    <div
      onClick={handleClick}
      className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all group flex gap-4"
    >
      {/* Image */}
      {news.image && (
        <div className="flex-shrink-0">
          <img
            src={news.image}
            alt={news.headline}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{news.source}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(news.datetime)}
          </span>
          {news.category && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full capitalize">
                {news.category}
              </span>
            </>
          )}
        </div>

        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {news.headline}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2">
          {news.summary}
        </p>
      </div>
    </div>
  );
}
