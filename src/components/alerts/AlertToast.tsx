"use client";
import { useEffect, useState } from "react";
import { useAlertsStore, PriceAlert } from "@/store/alerts";
import { useWatchlistStore } from "@/store/watchlist";
import { useStockQuote } from "@/hooks/useStockQuote";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ToastItem {
  alert: PriceAlert;
  currentPrice: number;
}

function SingleToast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="bg-card border border-amber-500/50 rounded-xl p-4 shadow-lg flex items-start gap-3 min-w-[280px]">
      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0 animate-pulse" />
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-sm font-semibold text-foreground">
          Price alert — {toast.alert.symbol}
        </p>
        <p className="text-xs text-muted-foreground">
          {toast.alert.symbol} is{" "}
          {toast.alert.condition === "above" ? "above" : "below"}{" "}
          {formatPrice(toast.alert.targetPrice)} · Now at{" "}
          {formatPrice(toast.currentPrice)}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-muted-foreground hover:text-foreground transition-colors text-xs flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

function AlertChecker({ symbol }: { symbol: string }) {
  const { alerts, triggerAlert } = useAlertsStore();
  const { data: quote } = useStockQuote(symbol);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!quote) return;

    const activeAlerts = alerts.filter(
      (a) => a.symbol === symbol && a.status === "active"
    );

    activeAlerts.forEach((alert) => {
      const triggered =
        (alert.condition === "above" && quote.c >= alert.targetPrice) ||
        (alert.condition === "below" && quote.c <= alert.targetPrice);

      if (triggered) {
        triggerAlert(alert.id);
        setToasts((prev) => [...prev, { alert, currentPrice: quote.c }]);
      }
    });
  }, [quote, alerts, symbol, triggerAlert]);

  return (
    <>
      {toasts.map((toast, i) => (
        <SingleToast
          key={toast.alert.id}
          toast={toast}
          onDismiss={() =>
            setToasts((prev) => prev.filter((_, idx) => idx !== i))
          }
        />
      ))}
    </>
  );
}

export function AlertToastContainer() {
  const { items } = useWatchlistStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {items.map((item) => (
        <AlertChecker key={item.symbol} symbol={item.symbol} />
      ))}
    </div>
  );
}