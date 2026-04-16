"use client";
import { useTheme } from "next-themes";
import { useWatchlistStore } from "@/store/watchlist";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function SettingsPanel() {
  const { theme, setTheme } = useTheme();
  const { items, clearWatchlist, removeSymbol } = useWatchlistStore();
  const [mounted, setMounted] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    setMounted(true);
    checkApiStatus();
  }, []);

  async function checkApiStatus() {
    try {
      const res = await fetch("/api/stock/quote/AAPL");
      if (res.ok) {
        setApiStatus("ok");
      } else {
        setApiStatus("error");
      }
    } catch {
      setApiStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-6">
        <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
            Manage your dashboard preferences
        </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <SettingsSection
            title="Appearance"
            description="Choose your preferred theme"
        >
            {mounted && (
            <div className="flex items-center gap-3">
                {["light", "dark", "system"].map((t) => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize",
                    theme === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-primary/50"
                    )}
                >
                    {t === "light" ? "○ Light" : t === "dark" ? "● Dark" : "◑ System"}
                </button>
                ))}
            </div>
            )}
        </SettingsSection>

        {/* API Status */}
        <SettingsSection
            title="API status"
            description="Connection status with Finnhub"
        >
            <div className="flex items-center gap-3">
            <div
                className={cn(
                "w-2.5 h-2.5 rounded-full",
                apiStatus === "checking"
                    ? "bg-yellow-500 animate-pulse"
                    : apiStatus === "ok"
                    ? "bg-green-500"
                    : "bg-red-500"
                )}
            />
            <span className="text-sm text-foreground">
                {apiStatus === "checking"
                ? "Checking connection..."
                : apiStatus === "ok"
                ? "Connected to Finnhub"
                : "Connection error"}
            </span>
            <button
                onClick={() => {
                setApiStatus("checking");
                checkApiStatus();
                }}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
                Refresh
            </button>
            </div>
        </SettingsSection>

        {/* Watchlist */}
        <SettingsSection
            title="Watchlist"
            description={`${items.length} symbol${items.length !== 1 ? "s" : ""} currently tracked`}
        >
            {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
                Your watchlist is empty.
            </p>
            ) : (
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                <div
                    key={item.symbol}
                    className="flex items-center justify-between px-3 py-2 bg-background rounded-lg border border-border"
                >
                    <div>
                    <span className="text-sm font-medium text-foreground">
                        {item.symbol}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                        {item.name}
                    </span>
                    </div>
                    <button
                    onClick={() => removeSymbol(item.symbol)}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors px-2 py-1 rounded"
                    >
                    Remove
                    </button>
                </div>
                ))}
                <button
                onClick={() => {
                    if (confirm("Are you sure you want to clear your watchlist?")) {
                    clearWatchlist();
                    }
                }}
                className="mt-2 w-full py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                Clear watchlist
                </button>
            </div>
            )}
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Project</span>
                <span className="text-sm text-foreground">StockDash</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm text-foreground">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stack</span>
                <span className="text-sm text-foreground">Next.js · TypeScript · Tailwind</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data</span>
                <span className="text-sm text-foreground">Finnhub API</span>
            </div>
            </div>
        </SettingsSection>
        </div>
    </div>
    );
}
