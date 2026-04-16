"use client";
import { useState } from "react";
import { useAlertsStore, AlertCondition } from "@/store/alerts";
import { useStockQuote } from "@/hooks/useStockQuote";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AlertsModalProps {
  symbol: string;
  onClose: () => void;
}

export function AlertsModal({ symbol, onClose }: AlertsModalProps) {
  const { alerts, addAlert, removeAlert } = useAlertsStore();
  const { data: quote } = useStockQuote(symbol);

  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<AlertCondition>("above");

  const symbolAlerts = alerts.filter((a) => a.symbol === symbol);

  function handleAdd() {
    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) return;
    addAlert(symbol, price, condition);
    setTargetPrice("");
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Price alerts — {symbol}
            </h2>
            {quote && (
              <p className="text-sm text-muted-foreground mt-0.5">
                Current price: {formatPrice(quote.c)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Add alert form */}
        <div className="flex flex-col gap-3 mb-6">
        <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as AlertCondition)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
            <option value="above">Price goes above</option>
            <option value="below">Price goes below</option>
        </select>
        <div className="flex items-center gap-2">
            <input
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="Target price..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
            onClick={handleAdd}
            disabled={!targetPrice}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            Add
            </button>
        </div>
        </div>

        {/* Alerts list */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Active alerts
          </p>
          {symbolAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No alerts set for {symbol}
            </p>
          ) : (
            symbolAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg border",
                alert.status === "triggered"
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-amber-500/30 bg-amber-500/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    alert.status === "active"
                        ? "bg-amber-500 animate-pulse"
                        : "bg-green-500"
                    )}
                  />
                  <span className="text-sm text-foreground">
                    {alert.condition === "above" ? "Above" : "Below"}{" "}
                    {formatPrice(alert.targetPrice)}
                  </span>
                  {alert.status === "triggered" && (
                    <span className="text-xs text-green-500">Triggered</span>
                    )}
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
