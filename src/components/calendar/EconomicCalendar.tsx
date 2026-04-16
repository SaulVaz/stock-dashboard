"use client";
import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/store/watchlist";
import { cn } from "@/lib/utils";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];

interface EarningsEvent {
  symbol: string;
  period: string;
  estimate: number | null;
  actual: number | null;
  surprise: number | null;
  surprisePercent: number | null;
  quarter: number;
  year: number;
}

interface CalendarEvent {
  id: string;
  symbol: string;
  date: string;
  type: "earnings";
  details: string;
  isPast: boolean;
  daysFromNow: number;
}

type FilterType = "all" | "earnings";

function getDaysFromNow(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CountdownBadge({ days }: { days: number }) {
  if (days < 0) {
    return (
      <span className="text-xs text-muted-foreground">
        {Math.abs(days)}d ago
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="text-xs font-medium text-amber-500 animate-pulse">
        Today
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="text-xs font-medium text-amber-500">
        In {days}d
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground">
      In {days}d
    </span>
  );
}

export function EconomicCalendar() {
  const { items } = useWatchlistStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    fetchAllEvents();
  }, [items]);

  async function fetchAllEvents() {
    setLoading(true);
    const allEvents: CalendarEvent[] = [];

    await Promise.all(
      items.map(async (item) => {
        try {
          // Earnings
          const earningsRes = await fetch(
            `/api/calendar/earnings/${item.symbol}`
            );
            if (earningsRes.ok) {
            const earningsData: EarningsEvent[] = await earningsRes.json();
            if (Array.isArray(earningsData)) {
                earningsData.slice(0, 4).forEach((e) => {
                if (!e.period) return;
                const days = getDaysFromNow(e.period);
                allEvents.push({
                    id: `${item.symbol}-earnings-${e.period}`,
                    symbol: item.symbol,
                    date: e.period,
                    type: "earnings",
                    details:
                    e.actual !== null && e.actual !== undefined
                        ? `EPS: $${e.actual} (est. $${e.estimate ?? "N/A"}) · Q${e.quarter} ${e.year}`
                        : `Q${e.quarter} ${e.year} · EPS est. $${e.estimate ?? "N/A"}`,
                    isPast: days < 0,
                    daysFromNow: days,
                });
                });
            }
            }
        } catch {}
      })
    );

    // Sort by date
    allEvents.sort((a, b) => {
      const diff = Math.abs(a.daysFromNow) - Math.abs(b.daysFromNow);
      if (a.daysFromNow >= 0 && b.daysFromNow < 0) return -1;
      if (a.daysFromNow < 0 && b.daysFromNow >= 0) return 1;
      return diff;
    });

    setEvents(allEvents);
    setLoading(false);
  }

  const filtered = events.filter((e) =>
    filter === "all" ? true : e.type === filter
  );

  const upcoming = filtered.filter((e) => !e.isPast);
  const past = filtered.filter((e) => e.isPast);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Earnings calendar
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Earnings reports for your watchlist
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-card border border-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex items-center justify-center py-20 bg-card border border-border rounded-xl">
          <p className="text-muted-foreground text-sm">
            No events found for your watchlist symbols.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Upcoming
              </h2>
              {upcoming.map((event) => {
                const symbolIndex = items.findIndex(
                  (i) => i.symbol === event.symbol
                );
                const color = COLORS[symbolIndex % COLORS.length];

                return (
                  <div
                    key={event.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                  >
                    <div
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color,
                            backgroundColor: `${color}20`,
                          }}
                        >
                          {event.symbol}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            event.type === "earnings"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-green-500/10 text-green-400"
                          )}
                        >
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {event.details}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-foreground">
                        {formatEventDate(event.date)}
                      </p>
                      <CountdownBadge days={event.daysFromNow} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Recent earnings
              </h2>
              {past.map((event) => {
                const symbolIndex = items.findIndex(
                  (i) => i.symbol === event.symbol
                );
                const color = COLORS[symbolIndex % COLORS.length];

                return (
                  <div
                    key={event.id}
                    className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                  >
                    <div
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color,
                            backgroundColor: `${color}20`,
                          }}
                        >
                          {event.symbol}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            event.type === "earnings"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-green-500/10 text-green-400"
                          )}
                        >
                          {event.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {event.details}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-foreground">
                        {formatEventDate(event.date)}
                      </p>
                      <CountdownBadge days={event.daysFromNow} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
