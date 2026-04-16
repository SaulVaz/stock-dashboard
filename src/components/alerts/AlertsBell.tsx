"use client";
import { useState } from "react";
import { useAlertsStore } from "@/store/alerts";
import { AlertsModal } from "./AlertsModal";
import { cn } from "@/lib/utils";

interface AlertsBellProps {
  symbol: string;
}

export function AlertsBell({ symbol }: AlertsBellProps) {
  const [showModal, setShowModal] = useState(false);
  const { alerts } = useAlertsStore();

  const activeAlerts = alerts.filter(
    (a) => a.symbol === symbol && a.status === "active"
  );

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={cn(
            "relative px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            activeAlerts.length > 0
                ? "border-amber-500/30 text-amber-500 bg-amber-500/10"
                : "text-muted-foreground border-border hover:text-foreground"
        )}
      >
        ♦ Alerts
        {activeAlerts.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {activeAlerts.length}
          </span>
        )}
      </button>

      {showModal && (
        <AlertsModal symbol={symbol} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}