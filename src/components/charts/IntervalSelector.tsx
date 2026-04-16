"use client";
import { TimeInterval } from "@/types/stock";
import { cn } from "@/lib/utils";

const INTERVALS: { label: string; value: TimeInterval }[] = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "30m", value: "30" },
  { label: "1h", value: "60" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
  { label: "1M", value: "M" },
];

interface IntervalSelectorProps {
  selected: TimeInterval;
  onChange: (interval: TimeInterval) => void;
}

export function IntervalSelector({ selected, onChange }: IntervalSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
      {INTERVALS.map((interval) => (
        <button
          key={interval.value}
          onClick={() => onChange(interval.value)}
          className={cn(
            "px-3 py-1 rounded-md text-xs font-medium transition-colors",
            selected === interval.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          {interval.label}
        </button>
      ))}
    </div>
  );
}
